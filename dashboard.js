/* ========================================
   TRADO - Dashboard JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Mobile Sidebar Toggle =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
    
    // ===== Period Buttons =====
    const periodBtns = document.querySelectorAll('.period-btn');
    
    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            periodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Simulate chart update
            updateChart(this.textContent);
        });
    });
    
    function updateChart(period) {
        const bars = document.querySelectorAll('.chart-bars .bar');
        const heights = {
            '7D': [40, 65, 45, 80, 55, 90, 70],
            '1M': [50, 70, 60, 75, 85, 65, 80],
            '3M': [60, 55, 75, 90, 70, 85, 95]
        };
        
        const selectedHeights = heights[period] || heights['7D'];
        
        bars.forEach((bar, index) => {
            bar.style.height = '0%';
            setTimeout(() => {
                bar.style.height = selectedHeights[index] + '%';
            }, index * 50);
        });
    }
    
    // ===== Animate Stats on Load =====
    const statValues = document.querySelectorAll('.stat-value-dash');
    
    statValues.forEach(stat => {
        const text = stat.textContent;
        if (text.includes('$')) {
            const number = parseFloat(text.replace(/[$,]/g, ''));
            animateValue(stat, 0, number, 1500, '$', true);
        } else if (text.includes('%')) {
            const number = parseFloat(text.replace('%', ''));
            animateValue(stat, 0, number, 1500, '%', false);
        }
    });
    
    function animateValue(element, start, end, duration, suffix, isCurrency) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;
            
            if (isCurrency) {
                element.textContent = '$' + current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else {
                element.textContent = current.toFixed(1) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // ===== Animate Chart Bars on Load =====
    const chartBars = document.querySelectorAll('.chart-bars .bar');
    
    chartBars.forEach((bar, index) => {
        const height = bar.style.height;
        bar.style.height = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'height 0.5s ease';
            bar.style.height = height;
        }, 300 + (index * 100));
    });
    
    // ===== Notification Click =====
    const notificationBtn = document.querySelector('.notification-btn');
    
    // Notification functionality is now in dashboard.html inline script
    
    // ===== Simulate Real-time Updates =====
    function simulateTradeUpdate() {
        const tradesList = document.querySelector('.trades-list');
        if (!tradesList) return;
        
        const trades = [
            { type: 'buy', amount: '+$87.30', time: 'Just now' },
            { type: 'sell', amount: '+$143.50', time: 'Just now' },
            { type: 'buy', amount: '+$56.20', time: 'Just now' },
        ];
        
        const randomTrade = trades[Math.floor(Math.random() * trades.length)];
        
        // Create new trade element
        const tradeItem = document.createElement('div');
        tradeItem.className = 'trade-item';
        tradeItem.style.opacity = '0';
        tradeItem.style.transform = 'translateY(-10px)';
        tradeItem.innerHTML = `
            <div class="trade-info">
                <span class="trade-pair">XAU/USD</span>
                <span class="trade-type ${randomTrade.type}">${randomTrade.type === 'buy' ? 'Buy' : 'Sell'}</span>
            </div>
            <div class="trade-details">
                <span class="trade-amount">${randomTrade.amount}</span>
                <span class="trade-time">${randomTrade.time}</span>
            </div>
        `;
        
        // Insert at the beginning
        tradesList.insertBefore(tradeItem, tradesList.firstChild);
        
        // Animate in
        setTimeout(() => {
            tradeItem.style.transition = 'all 0.3s ease';
            tradeItem.style.opacity = '1';
            tradeItem.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove last item if more than 5
        const items = tradesList.querySelectorAll('.trade-item');
        if (items.length > 5) {
            const lastItem = items[items.length - 1];
            lastItem.style.opacity = '0';
            setTimeout(() => lastItem.remove(), 300);
        }
    }
    
    // Simulate trade every 30 seconds (for demo)
    // setInterval(simulateTradeUpdate, 30000);
    
    console.log('Dashboard initialized successfully!');
});
