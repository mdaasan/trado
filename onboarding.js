/* ========================================
   TRADO - Onboarding JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    let currentStep = 1;
    let selectedPlan = null;
    let selectedPaymentMethod = 'card';
    let selectedBroker = null;
    
    // Elements
    const steps = document.querySelectorAll('.onboarding-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    
    // ===== Step 1: Plan Selection =====
    const planOptions = document.querySelectorAll('.plan-option');
    const step1NextBtn = document.querySelector('[data-step="1"] .btn-next');
    
    planOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected from all
            planOptions.forEach(p => p.classList.remove('selected'));
            // Add selected to clicked
            this.classList.add('selected');
            // Store selected plan
            selectedPlan = this.dataset.plan;
            // Enable next button
            step1NextBtn.disabled = false;
            
            // Update summary in step 2
            updatePlanSummary();
        });
    });
    
    function updatePlanSummary() {
        const summaryPlan = document.querySelector('.summary-plan');
        const summaryPrice = document.querySelector('.summary-price');
        const usdtAmount = document.querySelector('.usdt-amount');
        
        if (selectedPlan === 'basic') {
            if (summaryPlan) summaryPlan.textContent = 'Basic';
            if (summaryPrice) summaryPrice.innerHTML = '$150<small>/month</small>';
            if (usdtAmount) usdtAmount.textContent = '150.00';
        } else {
            if (summaryPlan) summaryPlan.textContent = 'Pro';
            if (summaryPrice) summaryPrice.innerHTML = '$300<small>/month</small>';
            if (usdtAmount) usdtAmount.textContent = '300.00';
        }
    }
    
    // ===== Copy Wallet Address =====
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', function() {
            const walletAddress = document.getElementById('walletAddress');
            if (walletAddress) {
                navigator.clipboard.writeText(walletAddress.textContent).then(() => {
                    this.classList.add('copied');
                    const copyText = this.querySelector('.copy-text');
                    if (copyText) copyText.textContent = 'Copied!';
                    
                    setTimeout(() => {
                        this.classList.remove('copied');
                        if (copyText) copyText.textContent = 'Copy';
                    }, 2000);
                });
            }
        });
    }
    
    // ===== Step 2: Payment Method =====
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentForms = document.querySelectorAll('.payment-form');
    const cryptoOptions = document.querySelectorAll('.crypto-option');
    const changePlanBtn = document.querySelector('.change-plan-btn');
    
    paymentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.dataset.method;
            
            // Update tabs
            paymentTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update forms
            paymentForms.forEach(f => f.classList.remove('active'));
            document.querySelector(`.payment-form[data-method="${method}"]`).classList.add('active');
            
            selectedPaymentMethod = method;
            
            // Update USDT amount if crypto selected
            if (method === 'crypto') {
                updateCryptoAmount();
            }
        });
    });
    
    // Update crypto amount based on selected plan
    function updateCryptoAmount() {
        const usdtAmount = document.querySelector('.usdt-amount');
        if (usdtAmount) {
            if (selectedPlan === 'basic') {
                usdtAmount.textContent = '150.00';
            } else {
                usdtAmount.textContent = '300.00';
            }
        }
    }
    
    // Copy wallet address
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const walletAddress = document.querySelector('.wallet-address').textContent;
            navigator.clipboard.writeText(walletAddress).then(() => {
                this.classList.add('copied');
                const btnText = this.querySelector('span');
                const originalText = btnText.textContent;
                btnText.textContent = 'Copied!';
                
                setTimeout(() => {
                    this.classList.remove('copied');
                    btnText.textContent = originalText;
                }, 2000);
            });
        });
    }
    
    if (changePlanBtn) {
        changePlanBtn.addEventListener('click', function() {
            goToStep(1);
        });
    }
    
    // Card form live preview
    const cardNameInput = document.getElementById('cardName');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    
    if (cardNameInput) {
        cardNameInput.addEventListener('input', function() {
            const holderName = document.querySelector('.holder-name');
            holderName.textContent = this.value.toUpperCase() || 'YOUR NAME';
        });
    }
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').replace(/\D/g, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
            this.value = formatted;
            
            // Update preview
            const preview = document.querySelector('.card-number-preview');
            let displayNum = '';
            for (let i = 0; i < 19; i++) {
                if (i === 4 || i === 9 || i === 14) {
                    displayNum += ' ';
                } else if (i < formatted.replace(/\s/g, '').length) {
                    displayNum += formatted.replace(/\s/g, '')[displayNum.replace(/\s/g, '').length];
                } else {
                    displayNum += '•';
                }
            }
            preview.textContent = formatted || '•••• •••• •••• ••••';
            
            // Detect card type
            const visaLogo = document.querySelector('.card-type .visa-logo');
            const mastercardLogo = document.querySelector('.card-type .mastercard-logo');
            const brandVisa = document.querySelector('.brand-visa');
            const brandMastercard = document.querySelector('.brand-mastercard');
            
            const firstDigit = value.charAt(0);
            const firstTwo = value.substring(0, 2);
            
            // Reset
            if (visaLogo) visaLogo.style.display = 'none';
            if (mastercardLogo) mastercardLogo.style.display = 'none';
            if (brandVisa) brandVisa.classList.remove('active');
            if (brandMastercard) brandMastercard.classList.remove('active');
            
            if (firstDigit === '4') {
                // Visa
                if (visaLogo) visaLogo.style.display = 'block';
                if (brandVisa) brandVisa.classList.add('active');
            } else if (['51', '52', '53', '54', '55'].includes(firstTwo) || 
                       (parseInt(firstTwo) >= 22 && parseInt(firstTwo) <= 27)) {
                // Mastercard
                if (mastercardLogo) mastercardLogo.style.display = 'block';
                if (brandMastercard) brandMastercard.classList.add('active');
            } else if (value.length === 0) {
                // Show Visa by default when empty
                if (visaLogo) visaLogo.style.display = 'block';
            }
        });
    }
    
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
            
            const expiryDate = document.querySelector('.expiry-date');
            expiryDate.textContent = value || 'MM/YY';
        });
    }
    
    // ===== Step 3: Broker Selection =====
    const brokerOptions = document.querySelectorAll('.broker-option');
    const apiFormContainer = document.querySelector('.api-form-container');
    const step3NextBtn = document.querySelector('[data-step="3"] .btn-next');
    
    brokerOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected from all
            brokerOptions.forEach(b => b.classList.remove('selected'));
            // Add selected to clicked
            this.classList.add('selected');
            // Store selected broker
            selectedBroker = this.dataset.broker;
            // Show API form
            apiFormContainer.style.display = 'block';
            // Enable next button after a delay (simulate form fill)
            checkApiForm();
        });
    });
    
    // API Form validation
    const apiKeyInput = document.getElementById('apiKey');
    const apiSecretInput = document.getElementById('apiSecret');
    
    function checkApiForm() {
        if (apiKeyInput && apiSecretInput) {
            const isValid = apiKeyInput.value.length > 0 && apiSecretInput.value.length > 0;
            step3NextBtn.disabled = !isValid;
        }
    }
    
    if (apiKeyInput) apiKeyInput.addEventListener('input', checkApiForm);
    if (apiSecretInput) apiSecretInput.addEventListener('input', checkApiForm);
    
    // Toggle password visibility for API secret
    const togglePasswordBtn = document.querySelector('.toggle-password-btn');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const input = document.getElementById('apiSecret');
            const eyeOpen = this.querySelector('.eye-open');
            const eyeClosed = this.querySelector('.eye-closed');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        });
    }
    
    // ===== Navigation =====
    const nextBtns = document.querySelectorAll('.btn-next');
    const backBtns = document.querySelectorAll('.btn-back');
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            if (currentStep < 3) {
                goToStep(currentStep + 1);
            } else {
                // Final step - show success
                showSuccess();
            }
        });
    });
    
    backBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });
    
    function goToStep(step) {
        // Update current step
        const prevStep = currentStep;
        currentStep = step;
        
        // Update step visibility
        steps.forEach(s => s.classList.remove('active'));
        document.querySelector(`.onboarding-step[data-step="${step}"]`).classList.add('active');
        
        // Update progress sidebar
        progressSteps.forEach((ps, index) => {
            const stepNum = index + 1;
            ps.classList.remove('active', 'completed');
            
            if (stepNum < currentStep) {
                ps.classList.add('completed');
            } else if (stepNum === currentStep) {
                ps.classList.add('active');
            }
        });
        
        // Update progress lines
        progressLines.forEach((line, index) => {
            line.classList.remove('active', 'completed');
            
            if (index < currentStep - 1) {
                line.classList.add('completed');
            } else if (index === currentStep - 1) {
                line.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    function showSuccess() {
        // Hide all steps
        steps.forEach(s => s.classList.remove('active'));
        
        // Mark all progress steps as completed
        progressSteps.forEach(ps => {
            ps.classList.remove('active');
            ps.classList.add('completed');
        });
        
        progressLines.forEach(line => {
            line.classList.remove('active');
            line.classList.add('completed');
        });
        
        // Update success summary
        const summaryPlanValue = document.querySelector('.success-summary .summary-value');
        const summaryBrokerValue = document.querySelectorAll('.success-summary .summary-value')[1];
        
        if (selectedPlan === 'basic') {
            summaryPlanValue.textContent = 'Basic - $150/mo';
        } else {
            summaryPlanValue.textContent = 'Pro - $300/mo';
        }
        
        // Format broker name
        const brokerNames = {
            'capital': 'Capital.com',
            'ig': 'IG Markets',
            'fxcm': 'FXCM',
            'oanda': 'OANDA',
            'forex': 'FOREX.com',
            'ctrader': 'cTrader',
            'atfx': 'ATFX'
        };
        summaryBrokerValue.textContent = brokerNames[selectedBroker] || selectedBroker;
        
        // Calculate trial end date (14 days from now)
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 14);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        document.querySelector('.trial-date').textContent = trialEnd.toLocaleDateString('en-US', options);
        
        // Show success step
        document.querySelector('.onboarding-step[data-step="success"]').classList.add('active');
    }
    
    // ===== Language Switching =====
    // Inherit from main script.js
    
    console.log('Onboarding initialized successfully!');
});
