// Main application controller
class WarehouseApp {
    constructor() {
        this.simulation = null;
        this.initElements();
        this.bindEvents();
        this.initSimulation();
        this.startClock();
        this.addLog('System initialized', 'info');
    }

    initElements() {
        // Control buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.addPackageBtn = document.getElementById('addPackageBtn');
        this.emergencyStopBtn = document.getElementById('emergencyStopBtn');
        this.clearLogBtn = document.getElementById('clearLogBtn');

        // Display elements
        this.packageCount = document.getElementById('packageCount');
        this.batteryLevel = document.getElementById('batteryLevel');
        this.robotSpeed = document.getElementById('robotSpeed');
        this.deliveredCount = document.getElementById('deliveredCount');
        this.distanceTraveled = document.getElementById('distanceTraveled');
        this.operationalTime = document.getElementById('operationalTime');
        this.energyUsed = document.getElementById('energyUsed');

        // Control elements
        this.speedControl = document.getElementById('speedControl');
        this.systemLog = document.getElementById('systemLog');

        // Mode buttons
        this.modeButtons = document.querySelectorAll('.mode-btn');
        
        // Manual control buttons
        this.upBtn = document.getElementById('upBtn');
        this.downBtn = document.getElementById('downBtn');
        this.leftBtn = document.getElementById('leftBtn');
        this.rightBtn = document.getElementById('rightBtn');
        this.stopBtn = document.getElementById('stopBtn');
    }

    initSimulation() {
        const canvas = document.getElementById('warehouseCanvas');
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 500;
        
        this.simulation = new Simulation(canvas);
        this.addLog('Warehouse simulation loaded', 'success');
    }

    bindEvents() {
        // Control buttons
        this.startBtn.addEventListener('click', () => {
            this.simulation.start();
            this.addLog('Simulation started', 'success');
            this.updateUI();
        });

        this.pauseBtn.addEventListener('click', () => {
            this.simulation.pause();
            this.addLog('Simulation paused', 'warning');
        });

        this.resetBtn.addEventListener('click', () => {
            this.simulation.reset();
            this.addLog('Simulation reset', 'info');
            this.updateUI();
        });

        this.addPackageBtn.addEventListener('click', () => {
            this.simulation.addRandomPackage();
            this.addLog('New package added to warehouse', 'info');
        });

        this.emergencyStopBtn.addEventListener('click', () => {
            this.simulation.emergencyStop();
            this.addLog('EMERGENCY STOP activated!', 'error');
        });

        this.clearLogBtn.addEventListener('click', () => {
            this.systemLog.innerHTML = '';
            this.addLog('Log cleared', 'info');
        });

        // Speed control
        this.speedControl.addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            this.simulation.setRobotSpeed(speed);
            this.robotSpeed.textContent = 
                speed === 1 ? 'Slow' : 
                speed === 2 ? 'Medium' : 
                speed === 3 ? 'Normal' : 
                speed === 4 ? 'Fast' : 'Turbo';
        });

        // Mode buttons
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.closest('.mode-btn').dataset.mode;
                this.setRobotMode(mode);
            });
        });

        // Manual controls
        this.upBtn.addEventListener('click', () => this.simulation.moveRobot('up'));
        this.downBtn.addEventListener('click', () => this.simulation.moveRobot('down'));
        this.leftBtn.addEventListener('click', () => this.simulation.moveRobot('left'));
        this.rightBtn.addEventListener('click', () => this.simulation.moveRobot('right'));
        this.stopBtn.addEventListener('click', () => this.simulation.moveRobot('stop'));

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.simulation.robot.mode === 'manual') {
                switch(e.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        this.simulation.moveRobot('up');
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        this.simulation.moveRobot('down');
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        this.simulation.moveRobot('left');
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        this.simulation.moveRobot('right');
                        break;
                    case ' ':
                        this.simulation.moveRobot('stop');
                        break;
                }
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            const canvas = document.getElementById('warehouseCanvas');
            canvas.width = canvas.parentElement.clientWidth;
            this.simulation.warehouse.resize(canvas.width, canvas.height);
        });
    }

    setRobotMode(mode) {
        this.simulation.setRobotMode(mode);
        
        // Update UI
        this.modeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        this.addLog(`Robot mode changed to: ${mode.toUpperCase()}`, 'info');
    }

    updateUI() {
        // Update statistics
        const stats = this.simulation.getStatistics();
        
        this.packageCount.textContent = stats.packages;
        this.batteryLevel.textContent = `${Math.round(stats.battery)}%`;
        this.deliveredCount.textContent = stats.delivered;
        this.distanceTraveled.textContent = `${stats.distance}m`;
        this.energyUsed.textContent = `${(stats.energy / 1000).toFixed(2)} kWh`;
        
        // Update package visualization
        this.updatePackageDisplay(stats.packages);
    }

    updatePackageDisplay(count) {
        // Visual feedback for package count
        const display = document.getElementById('packageCount');
        if (count > 10) {
            display.style.color = '#f72585';
            display.style.fontWeight = 'bold';
        } else if (count > 5) {
            display.style.color = '#f9c74f';
        } else {
            display.style.color = '#4cc9f0';
        }
    }

    addLog(message, type = 'info') {
        const time = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `
            <span class="log-time">[${time}]</span>
            ${message}
        `;
        this.systemLog.appendChild(logEntry);
        this.systemLog.scrollTop = this.systemLog.scrollHeight;
    }

    startClock() {
        setInterval(() => {
            const now = new Date();
            this.operationalTime.textContent = 
                now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }, 1000);
    }

    // Mock AI function (simulated AI responses)
    mockAICommand() {
        const commands = [
            'AI: Scanning for optimal path...',
            'AI: Package detected - calculating route',
            'AI: Battery optimization in progress',
            'AI: Obstacle avoidance activated',
            'AI: Route optimized for efficiency'
        ];
        return commands[Math.floor(Math.random() * commands.length)];
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WarehouseApp();
    
    // Update UI every second
    setInterval(() => {
        if (window.app.simulation) {
            window.app.updateUI();
            
            // Add occasional AI-like messages
            if (Math.random() > 0.95 && window.app.simulation.isRunning) {
                window.app.addLog(window.app.mockAICommand(), 'success');
            }
        }
    }, 1000);
});
