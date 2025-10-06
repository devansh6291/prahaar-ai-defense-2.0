// Prahaar-AI Defense Command Platform v2.0
class PrahaarDefensePlatform {
    constructor() {
        this.currentTab = 'dashboard';
        this.map = null;
        this.markers = [];
        this.messageId = 4;
        
        this.init();
    }
    
    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        this.initTabSwitching();
        document.addEventListener('tabChanged', (e) => {
            if (e.detail.tab === 'map' && !this.map) {
                setTimeout(() => this.initMap(), 100);
            }
        });
        this.startRealTimeUpdates();
        console.log('Prahaar-AI Defense Platform v2.0 initialized');
    }
    
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            timeZone: 'Asia/Kolkata'
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'Asia/Kolkata'
        });
        
        const timeDisplay = document.getElementById('current-time');
        if (timeDisplay) {
            timeDisplay.innerHTML = `${dateString}<br>${timeString}`;
        }
    }
    
    initTabSwitching() {
        const tabs = document.querySelectorAll('.nav-tab');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const targetContent = document.getElementById(targetTab + '-tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                this.currentTab = targetTab;
                document.dispatchEvent(new CustomEvent('tabChanged', {
                    detail: { tab: targetTab }
                }));
            });
        });
    }
    
    initMap() {
        try {
            if (typeof L === 'undefined') {
                console.warn('Leaflet not loaded, showing fallback');
                this.showMapFallback();
                return;
            }
            this.map = L.map('tactical-map').setView([28.6139, 77.2090], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);
            this.addUnitMarkers();
            this.addThreatMarkers();
            this.addSensorMarkers();
            console.log('Tactical map initialized');
        } catch (error) {
            console.error('Failed to initialize map:', error);
            this.showMapFallback();
        }
    }
    
    showMapFallback() {
        const mapContainer = document.getElementById('tactical-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="padding: 4rem 2rem; text-align: center; color: #cbd5e0; background: rgba(26, 35, 50, 0.5); border-radius: 0.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
                    <div style="font-size: 1.25rem; margin-bottom: 0.5rem;">Tactical Map Loading...</div>
                    <div style="font-size: 0.875rem; color: #a0aec0;">Map requires internet connection</div>
                    <div style="margin-top: 2rem; padding: 1rem; background: rgba(214, 158, 46, 0.1); border-radius: 0.25rem;">
                        <div style="font-weight: bold; color: var(--military-amber);">Simulated Coverage:</div>
                        <div style="margin-top: 0.5rem;">• 4 Active Units • 3 Threats Detected • 5 Sensors Online</div>
                    </div>
                </div>
            `;
        }
    }
    
    addUnitMarkers() {
        const units = [
            { id: 'ALPHA-01', name: 'Alpha Squadron', coords: [28.6139, 77.2090], status: 'ACTIVE' },
            { id: 'BRAVO-02', name: 'Bravo Armored', coords: [28.6179, 77.2100], status: 'ACTIVE' },
            { id: 'CHARLIE-03', name: 'Charlie Air Support', coords: [28.6200, 77.2080], status: 'STANDBY' },
            { id: 'DELTA-04', name: 'Delta Special Ops', coords: [28.6160, 77.2070], status: 'DEPLOYED' }
        ];
        units.forEach(unit => {
            const marker = L.circleMarker(unit.coords, {
                radius: 8,
                fillColor: '#48bb78',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.map);
            marker.bindPopup(`
                <div style="color: #1a202c;">
                    <strong>${unit.id}</strong><br>
                    ${unit.name}<br>
                    Status: <span style="color: #38a169;">${unit.status}</span>
                </div>
            `);
            this.markers.push(marker);
        });
    }
    
    addThreatMarkers() {
        const threats = [
            { id: 'T-001', type: 'VEHICLE', coords: [28.6250, 77.2150], severity: 'HIGH' },
            { id: 'T-002', type: 'PERSONNEL', coords: [28.6180, 77.2120], severity: 'MEDIUM' },
            { id: 'T-003', type: 'DRONE', coords: [28.6220, 77.2090], severity: 'HIGH' }
        ];
        threats.forEach(threat => {
            const color = threat.severity === 'HIGH' ? '#f56565' : '#ed8936';
            const marker = L.circleMarker(threat.coords, {
                radius: 10,
                fillColor: color,
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.map);
            marker.bindPopup(`
                <div style="color: #1a202c;">
                    <strong>${threat.id}</strong><br>
                    Type: ${threat.type}<br>
                    Severity: <span style="color: ${color};">${threat.severity}</span>
                </div>
            `);
            this.markers.push(marker);
        });
    }
    
    addSensorMarkers() {
        const sensors = [
            { id: 'DRONE-001', coords: [28.6190, 77.2110], type: 'Aerial' },
            { id: 'DRONE-002', coords: [28.6170, 77.2085], type: 'Tactical' },
            { id: 'GROUND-001', coords: [28.6155, 77.2095], type: 'Perimeter' }
        ];
        sensors.forEach(sensor => {
            const marker = L.circleMarker(sensor.coords, {
                radius: 6,
                fillColor: '#d69e2e',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.map);
            marker.bindPopup(`
                <div style="color: #1a202c;">
                    <strong>${sensor.id}</strong><br>
                    Type: ${sensor.type}<br>
                    Status: <span style="color: #38a169;">ACTIVE</span>
                </div>
            `);
            this.markers.push(marker);
        });
    }
    
    startRealTimeUpdates() {
        setInterval(() => {
            this.updateThreatAnalysis();
        }, 5000);
        setInterval(() => {
            this.updateSensorData();
        }, 3000);
    }
    
    updateThreatAnalysis() {
        const metrics = document.querySelectorAll('.metric-value');
        if (metrics.length > 0) {
            const values = ['1,247', '98.8%', '2.3s', '67%'];
            metrics.forEach((metric, index) => {
                if (values[index]) {
                    if (index === 0) {
                        const base = 1247;
                        const variation = Math.floor(Math.random() * 10) - 5;
                        metric.textContent = (base + variation).toLocaleString();
                    } else if (index === 1) {
                        const base = 98.8;
                        const variation = (Math.random() - 0.5) * 0.2;
                        metric.textContent = (base + variation).toFixed(1) + '%';
                    } else if (index === 2) {
                        const base = 2.3;
                        const variation = (Math.random() - 0.5) * 0.4;
                        metric.textContent = (base + variation).toFixed(1) + 's';
                    } else if (index === 3) {
                        const base = 67;
                        const variation = Math.floor(Math.random() * 20) - 10;
                        metric.textContent = Math.max(0, Math.min(100, base + variation)) + '%';
                    }
                }
            });
        }
    }
    
    updateSensorData() {
        const batteryElements = document.querySelectorAll('.stat');
        batteryElements.forEach(element => {
            const text = element.textContent;
            if (text.includes('Battery:')) {
                const currentValue = parseInt(text.match(/\d+/)[0]);
                const variation = Math.floor(Math.random() * 6) - 3;
                const newValue = Math.max(0, Math.min(100, currentValue + variation));
                element.textContent = `Battery: ${newValue}%`;
            } else if (text.includes('Signal:')) {
                const currentValue = parseInt(text.match(/\d+/)[0]);
                const variation = Math.floor(Math.random() * 10) - 5;
                const newValue = Math.max(0, Math.min(100, currentValue + variation));
                element.textContent = `Signal: ${newValue}%`;
            }
        });
    }
}

// Map control functions
function zoomToThreats() {
    if (window.prahaarPlatform && window.prahaarPlatform.map) {
        window.prahaarPlatform.map.setView([28.6220, 77.2120], 15);
    } else {
        alert('Map not available');
    }
}
function zoomToUnits() {
    if (window.prahaarPlatform && window.prahaarPlatform.map) {
        window.prahaarPlatform.map.setView([28.6170, 77.2085], 14);
    } else {
        alert('Map not available');
    }
}
function resetView() {
    if (window.prahaarPlatform && window.prahaarPlatform.map) {
        window.prahaarPlatform.map.setView([28.6139, 77.2090], 13);
    } else {
        alert('Map not available');
    }
}

// Communication functions
function sendMessage() {
    const toUnit = document.getElementById('message-to');
    const priority = document.getElementById('message-priority');
    const messageText = document.getElementById('message-text');
    if (!messageText || !messageText.value.trim()) {
        alert('Please enter a message');
        return;
    }
    const messageList = document.querySelector('.message-list');
    if (!messageList) return;
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item sent';
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    messageItem.innerHTML = `
        <div class="message-header">
            <span class="message-from">COMMAND</span>
            <span class="message-time">${timeString}</span>
            <span class="message-priority ${priority.value.toLowerCase()}">${priority.value}</span>
        </div>
        <div class="message-content">${messageText.value}</div>
        <div class="message-status">✓ SENT</div>
    `;
    messageList.appendChild(messageItem);
    messageText.value = '';
    messageList.scrollTop = messageList.scrollHeight;
    setTimeout(() => {
        const statusElement = messageItem.querySelector('.message-status');
        if (statusElement) {
            statusElement.textContent = '✓ DELIVERED';
        }
    }, 1000);
}

function sendEmergencyAlert() {
    const messageList = document.querySelector('.message-list');
    if (!messageList) return;
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item sent';
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    messageItem.innerHTML = `
        <div class="message-header">
            <span class="message-from">COMMAND</span>
            <span class="message-time">${timeString}</span>
            <span class="message-priority high" style="background: #f56565;">EMERGENCY</span>
        </div>
        <div class="message-content">🚨 EMERGENCY ALERT: All units report status immediately. Possible security breach detected.</div>
        <div class="message-status">✓ BROADCAST</div>
    `;
    messageList.appendChild(messageItem);
    messageList.scrollTop = messageList.scrollHeight;
    alert('Emergency alert broadcast to all units!');
}

function requestStatus() {
    const messageList = document.querySelector('.message-list');
    if (!messageList) return;
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item sent';
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    messageItem.innerHTML = `
        <div class="message-header">
            <span class="message-from">COMMAND</span>
            <span class="message-time">${timeString}</span>
            <span class="message-priority normal">NORMAL</span>
        </div>
        <div class="message-content">📊 All units provide current status report and position confirmation.</div>
        <div class="message-status">✓ SENT</div>
    `;
    messageList.appendChild(messageItem);
    messageList.scrollTop = messageList.scrollHeight;
    alert('Status report requested from all units!');
}

function initiateEvac() {
    const messageList = document.querySelector('.message-list');
    if (!messageList) return;
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item sent';
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    messageItem.innerHTML = `
        <div class="message-header">
            <span class="message-from">COMMAND</span>
            <span class="message-time">${timeString}</span>
            <span class="message-priority high">HIGH</span>
        </div>
        <div class="message-content">⚠️ EVACUATION ORDER: Begin immediate tactical withdrawal to secondary positions. Execute Protocol Alpha-7.</div>
        <div class="message-status">✓ PRIORITY SENT</div>
    `;
    messageList.appendChild(messageItem);
    messageList.scrollTop = messageList.scrollHeight;
    alert('Evacuation protocol initiated!');
}

document.addEventListener('DOMContentLoaded', () => {
    window.prahaarPlatform = new PrahaarDefensePlatform();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Platform paused');
    } else {
        console.log('Platform resumed');
    }
});

