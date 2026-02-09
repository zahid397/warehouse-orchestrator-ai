// Warehouse environment class
class Warehouse {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.gridSize = 40;
        this.shelves = [];
        this.packages = [];
        this.chargingStations = [];
        this.obstacles = [];
        this.waypoints = [];
        this.initWarehouse();
    }

    initWarehouse() {
        // Create shelves
        for (let x = 2; x < this.width / this.gridSize - 2; x += 3) {
            for (let y = 2; y < this.height / this.gridSize - 2; y += 3) {
                this.shelves.push({
                    x: x * this.gridSize,
                    y: y * this.gridSize,
                    width: this.gridSize * 2,
                    height: this.gridSize,
                    color: '#4a4e69',
                    id: `SHELF_${x}_${y}`
                });
            }
        }

        // Create charging stations
        this.chargingStations = [
            { x: 50, y: 50, width: 60, height: 40, color: '#38b000' },
            { x: this.width - 110, y: this.height - 90, width: 60, height: 40, color: '#38b000' }
        ];

        // Create initial obstacles
        this.obstacles = [
            { x: 200, y: 300, width: 60, height: 60, color: '#6a040f' },
            { x: 400, y: 150, width: 80, height: 40, color: '#6a040f' },
            { x: 600, y: 400, width: 40, height: 80, color: '#6a040f' }
        ];

        // Create waypoints
        this.createWaypoints();

        // Create initial packages
        this.addRandomPackage();
        this.addRandomPackage();
        this.addRandomPackage();
    }

    addRandomPackage() {
        const availableShelves = this.shelves.filter(shelf => 
            !this.packages.some(pkg => 
                Math.abs(pkg.x - shelf.x) < 20 && Math.abs(pkg.y - shelf.y) < 20
            )
        );

        if (availableShelves.length > 0) {
            const shelf = availableShelves[Math.floor(Math.random() * availableShelves.length)];
            this.packages.push({
                x: shelf.x + 10,
                y: shelf.y - 20,
                width: 20,
                height: 20,
                color: this.getRandomPackageColor(),
                destination: this.getRandomDestination(),
                id: `PKG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                weight: Math.floor(Math.random() * 10) + 1,
                priority: Math.random() > 0.7 ? 'HIGH' : 'NORMAL'
            });
        }
    }

    getRandomPackageColor() {
        const colors = [
            '#ff595e', // Red
            '#ffca3a', // Yellow
            '#8ac926', // Green
            '#1982c4', // Blue
            '#6a4c93'  // Purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomDestination() {
        const destinations = [
            { x: 100, y: this.height - 100, name: 'Shipping Dock A' },
            { x: this.width - 150, y: 100, name: 'Shipping Dock B' },
            { x: this.width / 2, y: this.height - 50, name: 'Processing Center' }
        ];
        return destinations[Math.floor(Math.random() * destinations.length)];
    }

    createWaypoints() {
        // Create grid-based waypoints for pathfinding
        const cols = Math.floor(this.width / this.gridSize);
        const rows = Math.floor(this.height / this.gridSize);
        
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (x % 2 === 0 && y % 2 === 0) {
                    const wx = x * this.gridSize + this.gridSize / 2;
                    const wy = y * this.gridSize + this.gridSize / 2;
                    
                    // Check if waypoint is not inside obstacle or shelf
                    const isClear = !this.isPositionOccupied(wx, wy, 10);
                    if (isClear) {
                        this.waypoints.push({ x: wx, y: wy });
                    }
                }
            }
        }
    }

    isPositionOccupied(x, y, radius = 0) {
        // Check collision with obstacles
        for (const obstacle of this.obstacles) {
            if (x + radius > obstacle.x && x - radius < obstacle.x + obstacle.width &&
                y + radius > obstacle.y && y - radius < obstacle.y + obstacle.height) {
                return true;
            }
        }
        
        // Check collision with shelves
        for (const shelf of this.shelves) {
            if (x + radius > shelf.x && x - radius < shelf.x + shelf.width &&
                y + radius > shelf.y && y - radius < shelf.y + shelf.height) {
                return true;
            }
        }
        
        return false;
    }

    removePackage(packageId) {
        this.packages = this.packages.filter(pkg => pkg.id !== packageId);
    }

    getClosestPackage(x, y) {
        if (this.packages.length === 0) return null;
        
        return this.packages.reduce((closest, pkg) => {
            const dist = Math.sqrt(Math.pow(pkg.x - x, 2) + Math.pow(pkg.y - y, 2));
            const closestDist = closest ? 
                Math.sqrt(Math.pow(closest.x - x, 2) + Math.pow(closest.y - y, 2)) : Infinity;
            return dist < closestDist ? pkg : closest;
        }, null);
    }

    getClosestChargingStation(x, y) {
        return this.chargingStations.reduce((closest, station) => {
            const dist = Math.sqrt(Math.pow(station.x - x, 2) + Math.pow(station.y - y, 2));
            const closestDist = closest ? 
                Math.sqrt(Math.pow(closest.x - x, 2) + Math.pow(closest.y - y, 2)) : Infinity;
            return dist < closestDist ? station : closest;
        }, null);
    }

    draw(ctx) {
        // Draw grid background
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.width; x += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= this.height; y += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // Draw shelves
        this.shelves.forEach(shelf => {
            ctx.fillStyle = shelf.color;
            ctx.fillRect(shelf.x, shelf.y, shelf.width, shelf.height);
            
            // Shelf label
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SHELF', shelf.x + shelf.width/2, shelf.y + shelf.height/2 + 3);
        });

        // Draw charging stations
        this.chargingStations.forEach(station => {
            ctx.fillStyle = station.color;
            ctx.fillRect(station.x, station.y, station.width, station.height);
            
            // Charging icon
            ctx.fillStyle = 'white';
            ctx.font = '20px FontAwesome';
            ctx.textAlign = 'center';
            ctx.fillText('⚡', station.x + station.width/2, station.y + station.height/2 + 7);
            
            // Label
            ctx.font = '10px Arial';
            ctx.fillText('CHARGER', station.x + station.width/2, station.y + station.height/2 + 20);
        });

        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Warning symbol
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚠', obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2 + 7);
        });

        // Draw packages
        this.packages.forEach(pkg => {
            // Package body
            ctx.fillStyle = pkg.color;
            ctx.fillRect(pkg.x, pkg.y, pkg.width, pkg.height);
            
            // Package border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.strokeRect(pkg.x, pkg.y, pkg.width, pkg.height);
            
            // Weight indicator
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(pkg.weight + 'kg', pkg.x + pkg.width/2, pkg.y + pkg.height/2 + 3);
            
            // Priority indicator
            if (pkg.priority === 'HIGH') {
                ctx.fillStyle = '#ff595e';
                ctx.beginPath();
                ctx.arc(pkg.x + pkg.width - 5, pkg.y + 5, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Draw destinations
        const destinations = [
            { x: 100, y: this.height - 100, name: 'Dock A', color: '#118ab2' },
            { x: this.width - 150, y: 100, name: 'Dock B', color: '#118ab2' },
            { x: this.width / 2, y: this.height - 50, name: 'Processing', color: '#118ab2' }
        ];
        
        destinations.forEach(dest => {
            ctx.fillStyle = dest.color;
            ctx.beginPath();
            ctx.arc(dest.x, dest.y, 25, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(dest.name, dest.x, dest.y + 4);
        });
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.waypoints = [];
        this.createWaypoints();
    }
}
