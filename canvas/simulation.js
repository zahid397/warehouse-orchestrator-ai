// Main simulation controller
class Simulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.warehouse = new Warehouse(this.width, this.height);
        this.robot = new Robot(this.width / 2, this.height / 2, this.warehouse);
        
        this.isRunning = false;
        this.lastTimestamp = 0;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.robot.setSpeed(3);
        this.start();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTimestamp = performance.now();
            this.animate();
        }
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    reset() {
        this.pause();
        this.warehouse = new Warehouse(this.width, this.height);
        this.robot = new Robot(this.width / 2, this.height / 2, this.warehouse);
        this.robot.setSpeed(3);
        this.start();
    }

    animate(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        
        if (this.isRunning) {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.width, this.height);
            
            // Update and draw warehouse
            this.warehouse.draw(this.ctx);
            
            // Update and draw robot
            this.robot.update();
            this.robot.draw(this.ctx);
            
            // Draw status text
            this.drawStatus();
        }
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    drawStatus() {
        const stats = this.robot.getStatistics();
        
        // Draw robot status
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Robot: ${stats.state.toUpperCase()}`, 20, 30);
        this.ctx.fillText(`Mode: ${stats.mode.toUpperCase()}`, 20, 50);
        this.ctx.fillText(`Battery: ${Math.round(stats.battery)}%`, 20, 70);
        
        // Draw package info
        if (this.robot.carryingPackage) {
            this.ctx.fillStyle = '#4cc9f0';
            this.ctx.fillText(`Carrying: ${this.robot.carryingPackage.id}`, 20, 90);
        }
        
        // Draw package count
        this.ctx.fillStyle = '#ffca3a';
        this.ctx.fillText(`Packages in warehouse: ${this.warehouse.packages.length}`, 20, 110);
    }

    setRobotSpeed(level) {
        this.robot.setSpeed(level);
    }

    setRobotMode(mode) {
        this.robot.setMode(mode);
    }

    moveRobot(direction) {
        this.robot.move(direction);
    }

    addRandomPackage() {
        this.warehouse.addRandomPackage();
    }

    emergencyStop() {
        this.robot.emergencyStop();
        this.isRunning = false;
        setTimeout(() => {
            if (this.robot.mode !== 'charging') {
                this.isRunning = true;
            }
        }, 2000);
    }

    getStatistics() {
        const robotStats = this.robot.getStatistics();
        return {
            packages: this.warehouse.packages.length,
            battery: robotStats.battery,
            delivered: robotStats.delivered,
            distance: robotStats.distance,
            energy: robotStats.energy,
            speed: robotStats.speed
        };
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.warehouse.resize(width, height);
    }
}
