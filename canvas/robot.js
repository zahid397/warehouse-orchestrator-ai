// Robot class
class Robot {
    constructor(x, y, warehouse) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.warehouse = warehouse;
        this.speed = 3;
        this.battery = 100;
        this.mode = 'auto'; // auto, manual, charging
        this.carryingPackage = null;
        this.destination = null;
        this.path = [];
        this.state = 'idle'; // idle, moving, charging, picking, delivering
        this.distanceTraveled = 0;
        this.energyUsed = 0;
        this.packagesDelivered = 0;
        this.color = '#7209b7';
        this.ledColor = '#4cc9f0';
        this.sensorRange = 100;
        this.lastUpdate = Date.now();
    }

    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // Consume battery
        if (this.state !== 'charging' && this.state !== 'idle') {
            this.battery -= 0.05 * (this.speed / 3) * deltaTime;
            this.energyUsed += 0.001 * this.speed * deltaTime;
        }

        // Recharge if at charging station
        if (this.state === 'charging') {
            this.battery = Math.min(100, this.battery + 20 * deltaTime);
            if (this.battery >= 100) {
                this.state = 'idle';
                this.mode = 'auto';
            }
        }

        // Auto mode logic
        if (this.mode === 'auto' && this.state !== 'charging') {
            this.autoBehavior();
        }

        // Move along path
        if (this.path.length > 0 && this.state === 'moving') {
            this.followPath();
        }

        // Keep robot in bounds
        this.x = Math.max(20, Math.min(this.warehouse.width - 20, this.x));
        this.y = Math.max(20, Math.min(this.warehouse.height - 20, this.y));

        // Update distance
        if (this.state === 'moving') {
            this.distanceTraveled += this.speed * deltaTime;
        }
    }

    autoBehavior() {
        if (this.battery < 20 && this.state !== 'charging') {
            this.goToChargingStation();
        } else if (this.carryingPackage) {
            this.deliverPackage();
        } else if (this.warehouse.packages.length > 0) {
            this.pickupPackage();
        } else {
            this.state = 'idle';
        }
    }

    pickupPackage() {
        const nearestPackage = this.warehouse.getClosestPackage(this.x, this.y);
        if (nearestPackage) {
            this.destination = { x: nearestPackage.x, y: nearestPackage.y };
            this.calculatePath();
            this.state = 'moving';
            
            // Check if arrived at package
            const distance = Math.sqrt(
                Math.pow(this.x - nearestPackage.x, 2) + 
                Math.pow(this.y - nearestPackage.y, 2)
            );
            
            if (distance < 30) {
                this.carryingPackage = nearestPackage;
                this.warehouse.removePackage(nearestPackage.id);
                this.destination = nearestPackage.destination;
                this.calculatePath();
                this.state = 'picking';
                setTimeout(() => this.state = 'moving', 1000);
            }
        }
    }

    deliverPackage() {
        if (this.carryingPackage && this.destination) {
            const distance = Math.sqrt(
                Math.pow(this.x - this.destination.x, 2) + 
                Math.pow(this.y - this.destination.y, 2)
            );
            
            if (distance < 40) {
                // Package delivered
                this.carryingPackage = null;
                this.destination = null;
                this.path = [];
                this.packagesDelivered++;
                this.state = 'delivering';
                setTimeout(() => this.state = 'idle', 1000);
            }
        }
    }

    goToChargingStation() {
        const station = this.warehouse.getClosestChargingStation(this.x, this.y);
        if (station) {
            this.destination = { 
                x: station.x + station.width / 2, 
                y: station.y + station.height / 2 
            };
            this.calculatePath();
            this.state = 'moving';
            
            const distance = Math.sqrt(
                Math.pow(this.x - this.destination.x, 2) + 
                Math.pow(this.y - this.destination.y, 2)
            );
            
            if (distance < 30) {
                this.state = 'charging';
                this.mode = 'charging';
            }
        }
    }

    calculatePath() {
        if (!this.destination) return;
        
        // Simple A* pathfinding simulation
        this.path = [];
        const steps = 50;
        const dx = (this.destination.x - this.x) / steps;
        const dy = (this.destination.y - this.y) / steps;
        
        for (let i = 1; i <= steps; i++) {
            const point = {
                x: this.x + dx * i,
                y: this.y + dy * i
            };
            
            // Avoid obstacles
            if (!this.warehouse.isPositionOccupied(point.x, point.y, this.width / 2)) {
                this.path.push(point);
            } else {
                // Try alternative path
                point.x += Math.random() * 40 - 20;
                point.y += Math.random() * 40 - 20;
                this.path.push(point);
            }
        }
    }

    followPath() {
        if (this.path.length > 0) {
            const target = this.path[0];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) {
                this.path.shift();
            } else {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
        } else {
            this.state = 'idle';
        }
    }

    move(direction) {
        if (this.mode !== 'manual') return;
        
        this.state = 'moving';
        const speed = this.speed;
        
        switch(direction) {
            case 'up':
                this.y -= speed;
                break;
            case 'down':
                this.y += speed;
                break;
            case 'left':
                this.x -= speed;
                break;
            case 'right':
                this.x += speed;
                break;
            case 'stop':
                this.state = 'idle';
                break;
        }
        
        // Check for collisions
        if (this.warehouse.isPositionOccupied(this.x, this.y, this.width / 2)) {
            // Reverse move if collision
            switch(direction) {
                case 'up': this.y += speed; break;
                case 'down': this.y -= speed; break;
                case 'left': this.x += speed; break;
                case 'right': this.x -= speed; break;
            }
        }
    }

    setSpeed(level) {
        this.speed = level * 2;
    }

    setMode(mode) {
        this.mode = mode;
        if (mode === 'charging') {
            this.state = 'charging';
        } else if (mode === 'manual') {
            this.state = 'idle';
            this.path = [];
        }
    }

    emergencyStop() {
        this.state = 'idle';
        this.path = [];
        this.mode = 'manual';
    }

    draw(ctx) {
        // Robot body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x - this.width/2, this.y - this.height/2, 
                     this.width, this.height, 10);
        ctx.fill();
        
        // Robot border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // LED indicator based on state
        ctx.fillStyle = this.getStateColor();
        ctx.beginPath();
        ctx.arc(this.x, this.y - 15, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Robot "face"
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x - 8, this.y + 5, 4, 0, Math.PI * 2); // Left eye
        ctx.arc(this.x + 8, this.y + 5, 4, 0, Math.PI * 2); // Right eye
        ctx.fill();
        
        // Carrying package indicator
        if (this.carryingPackage) {
            ctx.fillStyle = this.carryingPackage.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y - 25, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📦', this.x, this.y - 23);
        }
        
        // Battery indicator
        this.drawBatteryIndicator(ctx);
        
        // Draw path if exists
        if (this.path.length > 0) {
            ctx.strokeStyle = 'rgba(76, 201, 240, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            this.path.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.stroke();
        }
        
        // Draw destination marker
        if (this.destination) {
            ctx.strokeStyle = '#38b000';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.destination.x, this.destination.y, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Draw sensor range
        if (this.state === 'moving') {
            ctx.strokeStyle = 'rgba(76, 201, 240, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sensorRange, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    drawBatteryIndicator(ctx) {
        const batteryWidth = 30;
        const batteryHeight = 10;
        const batteryX = this.x - batteryWidth/2;
        const batteryY = this.y + 20;
        
        // Battery outline
        ctx.fillStyle = 'white';
        ctx.fillRect(batteryX, batteryY, batteryWidth, batteryHeight);
        
        // Battery level
        const levelWidth = (batteryWidth - 4) * (this.battery / 100);
        ctx.fillStyle = this.battery > 20 ? '#38b000' : '#f72585';
        ctx.fillRect(batteryX + 2, batteryY + 2, levelWidth, batteryHeight - 4);
    }

    getStateColor() {
        switch(this.state) {
            case 'idle': return '#f9c74f';
            case 'moving': return '#4cc9f0';
            case 'charging': return '#38b000';
            case 'picking': return '#ff595e';
            case 'delivering': return '#8ac926';
            default: return '#ffffff';
        }
    }

    getStatistics() {
        return {
            battery: this.battery,
            speed: this.speed,
            distance: Math.round(this.distanceTraveled),
            delivered: this.packagesDelivered,
            energy: this.energyUsed,
            state: this.state,
            mode: this.mode
        };
    }
}
