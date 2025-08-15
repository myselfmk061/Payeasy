// PayEasy App JavaScript - Fully Fixed Version
class PayEasyApp {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.selectedService = null;
        this.selectedPaymentMethod = null;
        this.currentTransaction = null;
        
        // Sample data from provided JSON
        this.data = {
            users: [
                {"id": 1, "name": "Rajesh Kumar", "mobile": "+91-9876543210", "email": "rajesh@email.com", "wallet_balance": 1250.50, "total_recharges": 45, "cashback_earned": 890.25, "referral_count": 12, "status": "active", "kyc_status": "verified", "join_date": "2024-08-15"},
                {"id": 2, "name": "Priya Sharma", "mobile": "+91-8765432109", "email": "priya@email.com", "wallet_balance": 2100.75, "total_recharges": 67, "cashback_earned": 1250.80, "referral_count": 8, "status": "active", "kyc_status": "verified", "join_date": "2024-07-22"},
                {"id": 3, "name": "Amit Singh", "mobile": "+91-7654321098", "email": "amit@email.com", "wallet_balance": 890.25, "total_recharges": 32, "cashback_earned": 567.90, "referral_count": 15, "status": "active", "kyc_status": "pending", "join_date": "2024-09-10"}
            ],
            transactions: [
                {"id": 1, "user_id": 1, "type": "Mobile Recharge", "operator": "Airtel", "amount": 399, "cashback": 19.95, "status": "success", "date": "2025-08-15 14:30", "mobile": "9876543210"},
                {"id": 2, "user_id": 2, "type": "DTH Recharge", "operator": "Tata Sky", "amount": 650, "cashback": 32.50, "status": "success", "date": "2025-08-15 12:15", "account": "123456789"},
                {"id": 3, "user_id": 1, "type": "Electricity Bill", "operator": "MSEB", "amount": 1250, "cashback": 25.00, "status": "success", "date": "2025-08-14 16:45", "account": "12345ABC"},
                {"id": 4, "user_id": 3, "type": "Mobile Recharge", "operator": "Jio", "amount": 199, "cashback": 9.95, "status": "pending", "date": "2025-08-15 18:20", "mobile": "7654321098"}
            ],
            services: [
                {"id": 1, "name": "Mobile Recharge", "icon": "📱", "cashback": "5%", "operators": ["Airtel", "Jio", "Vi", "BSNL"], "popular_amounts": [199, 399, 599, 999]},
                {"id": 2, "name": "DTH Recharge", "icon": "📺", "cashback": "3%", "operators": ["Tata Sky", "Dish TV", "Airtel Digital TV", "D2H"], "popular_amounts": [300, 500, 750, 1000]},
                {"id": 3, "name": "FASTag Recharge", "icon": "🛣️", "cashback": "2%", "operators": ["ICICI", "HDFC", "Paytm", "NHAI"], "popular_amounts": [200, 500, 1000, 2000]},
                {"id": 4, "name": "Electricity Bill", "icon": "⚡", "cashback": "1%", "operators": ["MSEB", "PSEB", "KSEB", "TNEB"], "avg_amount": 1200},
                {"id": 5, "name": "Gas Bill", "icon": "🔥", "cashback": "2%", "operators": ["HP Gas", "Indane", "Bharatgas"], "avg_amount": 850},
                {"id": 6, "name": "Water Bill", "icon": "💧", "cashback": "1.5%", "operators": ["Municipal Corporation", "Water Board"], "avg_amount": 450}
            ],
            offers: [
                {"id": 1, "title": "50% Cashback on First Recharge", "description": "Get up to ₹100 cashback", "code": "FIRST50", "valid_till": "2025-08-31", "min_amount": 200, "cashback_percent": 50, "max_cashback": 100},
                {"id": 2, "title": "DTH Special", "description": "10% extra cashback on DTH recharges", "code": "DTH10", "valid_till": "2025-09-15", "min_amount": 300, "cashback_percent": 10, "service": "DTH"},
                {"id": 3, "title": "Refer & Earn", "description": "Earn ₹50 for each successful referral", "reward": 50, "type": "referral"}
            ],
            analytics: {
                daily_transactions: [120, 145, 98, 176, 203, 189, 234],
                weekly_revenue: [45000, 52000, 48000, 67000, 71000, 69000, 78000],
                service_wise_usage: {"Mobile": 45, "DTH": 25, "Bills": 20, "FASTag": 10},
                success_rate: 96.5,
                total_users: 50000,
                active_users: 32000,
                total_revenue: 2500000
            }
        };
    }

    init() {
        this.initOTPInputs();
        this.loadRecentTransactions();
        this.loadUsersTable();
        this.loadTransactionsTable();
        this.loadRecentActivity();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Set up amount input listener
        const amountInput = document.getElementById('recharge-amount');
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                if (this.selectedService) {
                    this.updateCashbackAmount();
                }
            });
        }

        // Set up search functionality
        const userSearch = document.getElementById('user-search');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                this.filterUsers(e.target.value);
            });
        }

        // Set up transaction filter
        const transactionFilter = document.getElementById('transaction-filter');
        if (transactionFilter) {
            transactionFilter.addEventListener('change', (e) => {
                this.filterTransactions(e.target.value);
            });
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    // Authentication Functions
    showLogin() {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('admin-login-form').classList.add('hidden');
        document.getElementById('otp-form').classList.add('hidden');
    }

    showRegister() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('admin-login-form').classList.add('hidden');
        document.getElementById('otp-form').classList.add('hidden');
    }

    showAdminLogin() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('admin-login-form').classList.remove('hidden');
        document.getElementById('otp-form').classList.add('hidden');
    }

    login() {
        const mobile = document.getElementById('login-mobile').value;
        const pin = document.getElementById('login-pin').value;

        if (!mobile || !pin) {
            this.showToast('Please enter mobile number and PIN', 'error');
            return;
        }

        // Simulate login validation
        const user = this.data.users.find(u => u.mobile === mobile);
        if (user) {
            this.currentUser = user;
            this.showUserDashboard();
            this.showToast('Login successful!', 'success');
        } else {
            this.showToast('Invalid credentials', 'error');
        }
    }

    register() {
        const name = document.getElementById('register-name').value;
        const mobile = document.getElementById('register-mobile').value;
        const email = document.getElementById('register-email').value;
        const pin = document.getElementById('register-pin').value;

        if (!name || !mobile || !email || !pin) {
            this.showToast('Please fill all fields', 'error');
            return;
        }

        // Show OTP form
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('otp-form').classList.remove('hidden');
        this.showToast('OTP sent to your mobile number', 'success');
    }

    adminLogin() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        if (username === 'admin' && password === 'admin123') {
            this.isAdmin = true;
            this.showAdminDashboard();
            this.showToast('Admin login successful!', 'success');
        } else {
            this.showToast('Invalid admin credentials', 'error');
        }
    }

    verifyOTP() {
        const otpInputs = document.querySelectorAll('.otp-input');
        const otp = Array.from(otpInputs).map(input => input.value).join('');

        if (otp.length === 4) {
            // Create new user
            const newUser = {
                id: this.data.users.length + 1,
                name: document.getElementById('register-name').value,
                mobile: document.getElementById('register-mobile').value,
                email: document.getElementById('register-email').value,
                wallet_balance: 0,
                total_recharges: 0,
                cashback_earned: 0,
                referral_count: 0,
                status: 'active',
                kyc_status: 'pending',
                join_date: new Date().toISOString().split('T')[0]
            };

            this.data.users.push(newUser);
            this.currentUser = newUser;
            this.showUserDashboard();
            this.showToast('Registration successful!', 'success');
        } else {
            this.showToast('Please enter complete OTP', 'error');
        }
    }

    resendOTP() {
        this.showToast('OTP resent successfully', 'success');
    }

    logout() {
        this.currentUser = null;
        this.showAuthScreen();
        this.showToast('Logged out successfully', 'success');
    }

    adminLogout() {
        this.isAdmin = false;
        this.showAuthScreen();
        this.showToast('Admin logged out successfully', 'success');
    }

    // Screen Navigation
    showAuthScreen() {
        this.hideAllScreens();
        document.getElementById('auth-screen').classList.add('active');
        this.showLogin();
    }

    showUserDashboard() {
        this.hideAllScreens();
        document.getElementById('user-dashboard').classList.add('active');
        this.updateUserDashboard();
    }

    showAdminDashboard() {
        this.hideAllScreens();
        document.getElementById('admin-dashboard').classList.add('active');
        this.showAdminOverview();
        // Initialize charts after DOM is ready
        setTimeout(() => {
            this.initAdminCharts();
        }, 100);
    }

    hideAllScreens() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
    }

    // User Dashboard Functions
    updateUserDashboard() {
        if (!this.currentUser) return;

        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('wallet-balance').textContent = this.currentUser.wallet_balance.toFixed(2);
        document.getElementById('cashback-earned').textContent = this.currentUser.cashback_earned.toFixed(2);
        document.getElementById('user-ref-code').textContent = this.currentUser.id.toString().padStart(5, '0');
        document.getElementById('referral-count').textContent = this.currentUser.referral_count;
        document.getElementById('referral-earnings').textContent = (this.currentUser.referral_count * 50).toFixed(0);
    }

    loadRecentTransactions() {
        const container = document.getElementById('recent-transactions');
        if (!container) return;

        const userTransactions = this.data.transactions
            .filter(t => !this.currentUser || t.user_id === this.currentUser.id)
            .slice(0, 5);

        container.innerHTML = userTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <h4>${transaction.type}</h4>
                    <p>${transaction.operator} • ${transaction.date}</p>
                </div>
                <div class="transaction-amount">
                    <div class="amount">₹${transaction.amount}</div>
                    <div class="cashback">+₹${transaction.cashback} cashback</div>
                </div>
            </div>
        `).join('');
    }

    // Recharge Functions
    showRecharge(serviceType) {
        const serviceMap = {
            'mobile': 1,
            'dth': 2,
            'fastag': 3,
            'electricity': 4,
            'gas': 5,
            'water': 6
        };

        const serviceId = serviceMap[serviceType];
        const service = this.data.services.find(s => s.id === serviceId);
        
        if (!service) return;

        this.selectedService = service;
        
        // Update modal content
        document.getElementById('recharge-title').textContent = service.name;
        
        // Populate operators
        const operatorSelect = document.getElementById('recharge-operator');
        operatorSelect.innerHTML = '<option value="">Select Operator</option>';
        service.operators.forEach(operator => {
            operatorSelect.innerHTML += `<option value="${operator}">${operator}</option>`;
        });

        // Populate popular amounts
        const popularAmountsContainer = document.getElementById('popular-amounts');
        if (service.popular_amounts) {
            popularAmountsContainer.innerHTML = service.popular_amounts.map(amount => 
                `<div class="amount-button" onclick="app.selectAmount(${amount})">₹${amount}</div>`
            ).join('');
        } else {
            popularAmountsContainer.innerHTML = '';
        }

        // Show modal
        document.getElementById('recharge-modal').classList.add('active');
    }

    selectAmount(amount) {
        document.getElementById('recharge-amount').value = amount;
        
        // Update visual selection
        document.querySelectorAll('.amount-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Find and select the clicked button
        const buttons = document.querySelectorAll('.amount-button');
        buttons.forEach(btn => {
            if (btn.textContent === `₹${amount}`) {
                btn.classList.add('selected');
            }
        });

        this.updateCashbackAmount();
    }

    updateCashbackAmount() {
        const amount = parseFloat(document.getElementById('recharge-amount').value) || 0;
        const cashbackPercent = parseFloat(this.selectedService.cashback.replace('%', '')) / 100;
        const cashback = amount * cashbackPercent;
        
        document.getElementById('cashback-amount').textContent = `₹${cashback.toFixed(2)}`;
    }

    proceedToPayment() {
        const number = document.getElementById('recharge-number').value;
        const operator = document.getElementById('recharge-operator').value;
        const amount = document.getElementById('recharge-amount').value;

        if (!number || !operator || !amount) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }

        this.currentTransaction = {
            type: this.selectedService.name,
            operator: operator,
            amount: parseFloat(amount),
            number: number,
            cashback: parseFloat(amount) * (parseFloat(this.selectedService.cashback.replace('%', '')) / 100)
        };

        // Update payment modal
        document.getElementById('payment-amount').textContent = amount;
        document.getElementById('payment-wallet-balance').textContent = this.currentUser ? this.currentUser.wallet_balance.toFixed(2) : '0.00';

        // Close recharge modal and show payment modal
        document.getElementById('recharge-modal').classList.remove('active');
        document.getElementById('payment-modal').classList.add('active');
    }

    selectPaymentMethod(method) {
        this.selectedPaymentMethod = method;
        
        // Update visual selection
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        
        const target = document.querySelector(`input[value="${method}"]`).closest('.payment-method');
        if (target) {
            target.classList.add('selected');
        }

        // Update radio button
        document.querySelector(`input[value="${method}"]`).checked = true;
    }

    processPayment() {
        if (!this.selectedPaymentMethod) {
            this.showToast('Please select a payment method', 'error');
            return;
        }

        // Check wallet balance if wallet payment
        if (this.selectedPaymentMethod === 'wallet' && this.currentUser) {
            if (this.currentUser.wallet_balance < this.currentTransaction.amount) {
                this.showToast('Insufficient wallet balance', 'error');
                return;
            }
        }

        // Close payment modal and show loading
        document.getElementById('payment-modal').classList.remove('active');
        document.getElementById('loading-modal').classList.add('active');

        // Simulate payment processing
        setTimeout(() => {
            this.completeTransaction();
        }, 3000);
    }

    completeTransaction() {
        // Update user wallet and stats
        if (this.currentUser) {
            if (this.selectedPaymentMethod === 'wallet') {
                this.currentUser.wallet_balance -= this.currentTransaction.amount;
            }
            this.currentUser.wallet_balance += this.currentTransaction.cashback;
            this.currentUser.cashback_earned += this.currentTransaction.cashback;
            this.currentUser.total_recharges += 1;
        }

        // Add transaction to history
        const newTransaction = {
            id: this.data.transactions.length + 1,
            user_id: this.currentUser ? this.currentUser.id : 1,
            type: this.currentTransaction.type,
            operator: this.currentTransaction.operator,
            amount: this.currentTransaction.amount,
            cashback: this.currentTransaction.cashback,
            status: 'success',
            date: new Date().toLocaleString(),
            mobile: this.currentTransaction.number
        };

        this.data.transactions.unshift(newTransaction);

        // Generate transaction ID
        const txnId = 'TXN' + Date.now().toString().slice(-9);

        // Update success modal
        document.getElementById('success-amount').textContent = this.currentTransaction.amount.toFixed(2);
        document.getElementById('success-cashback').textContent = this.currentTransaction.cashback.toFixed(2);
        document.getElementById('success-txn-id').textContent = txnId;

        // Close loading and show success
        document.getElementById('loading-modal').classList.remove('active');
        document.getElementById('success-modal').classList.add('active');

        // Update dashboard data
        this.updateUserDashboard();
        this.loadRecentTransactions();
    }

    // Admin Functions
    showAdminOverview() {
        this.hideAllAdminPanels();
        document.getElementById('admin-overview').classList.add('active');
        this.updateAdminNavigation('Overview');
        this.updateAdminStats();
    }

    showUserManagement() {
        this.hideAllAdminPanels();
        document.getElementById('admin-users').classList.add('active');
        this.updateAdminNavigation('Users');
        this.loadUsersTable();
    }

    showTransactionManagement() {
        this.hideAllAdminPanels();
        document.getElementById('admin-transactions').classList.add('active');
        this.updateAdminNavigation('Transactions');
        this.loadTransactionsTable();
    }

    hideAllAdminPanels() {
        document.querySelectorAll('.admin-panel').forEach(panel => {
            panel.classList.remove('active');
        });
    }

    updateAdminNavigation(activeSection) {
        document.querySelectorAll('.admin-nav .nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.textContent.trim() === activeSection) {
                item.classList.add('active');
            }
        });
    }

    updateAdminStats() {
        document.getElementById('total-users-stat').textContent = this.data.analytics.total_users.toLocaleString();
        document.getElementById('total-revenue-stat').textContent = '₹' + this.data.analytics.total_revenue.toLocaleString();
        document.getElementById('success-rate-stat').textContent = this.data.analytics.success_rate + '%';
        document.getElementById('today-transactions-stat').textContent = this.data.analytics.daily_transactions[6];
    }

    initAdminCharts() {
        // Daily Transactions Chart
        const dailyCtx = document.getElementById('daily-transactions-chart');
        if (dailyCtx) {
            new Chart(dailyCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Transactions',
                        data: this.data.analytics.daily_transactions,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Service Usage Chart
        const serviceCtx = document.getElementById('service-usage-chart');
        if (serviceCtx) {
            new Chart(serviceCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(this.data.analytics.service_wise_usage),
                    datasets: [{
                        data: Object.values(this.data.analytics.service_wise_usage),
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    loadUsersTable() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        tbody.innerHTML = this.data.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.mobile}</td>
                <td>${user.email}</td>
                <td>₹${user.wallet_balance.toFixed(2)}</td>
                <td><span class="status status--${user.kyc_status === 'verified' ? 'success' : 'warning'}">${user.kyc_status}</span></td>
                <td><span class="status status--${user.status === 'active' ? 'success' : 'error'}">${user.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--outline btn--sm" onclick="app.viewUser(${user.id})">View</button>
                        <button class="btn btn--secondary btn--sm" onclick="app.editUser(${user.id})">Edit</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadTransactionsTable() {
        const tbody = document.getElementById('transactions-table-body');
        if (!tbody) return;

        tbody.innerHTML = this.data.transactions.map(txn => {
            const user = this.data.users.find(u => u.id === txn.user_id);
            return `
                <tr>
                    <td>${txn.id}</td>
                    <td>${user ? user.name : 'Unknown'}</td>
                    <td>${txn.type}</td>
                    <td>₹${txn.amount}</td>
                    <td>₹${txn.cashback}</td>
                    <td><span class="status status--${txn.status === 'success' ? 'success' : txn.status === 'pending' ? 'warning' : 'error'}">${txn.status}</span></td>
                    <td>${txn.date}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn--outline btn--sm" onclick="app.viewTransaction(${txn.id})">View</button>
                            ${txn.status === 'pending' ? '<button class="btn btn--primary btn--sm" onclick="app.approveTransaction(' + txn.id + ')">Approve</button>' : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadRecentActivity() {
        const container = document.getElementById('recent-activity-list');
        if (!container) return;

        const activities = [
            'New user registration: Priya Sharma',
            'Transaction completed: ₹399 Mobile Recharge',
            'KYC verification approved for Rajesh Kumar',
            'Cashback credited: ₹19.95',
            'System maintenance scheduled'
        ];

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <span>${activity}</span>
                <span class="text-muted">${new Date().toLocaleTimeString()}</span>
            </div>
        `).join('');
    }

    // Filter functions
    filterUsers(searchTerm) {
        const filteredUsers = this.data.users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.mobile.includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.renderUsersTable(filteredUsers);
    }

    filterTransactions(status) {
        let filteredTransactions = this.data.transactions;
        
        if (status !== 'all') {
            filteredTransactions = this.data.transactions.filter(txn => txn.status === status);
        }
        
        this.renderTransactionsTable(filteredTransactions);
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.mobile}</td>
                <td>${user.email}</td>
                <td>₹${user.wallet_balance.toFixed(2)}</td>
                <td><span class="status status--${user.kyc_status === 'verified' ? 'success' : 'warning'}">${user.kyc_status}</span></td>
                <td><span class="status status--${user.status === 'active' ? 'success' : 'error'}">${user.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--outline btn--sm" onclick="app.viewUser(${user.id})">View</button>
                        <button class="btn btn--secondary btn--sm" onclick="app.editUser(${user.id})">Edit</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderTransactionsTable(transactions) {
        const tbody = document.getElementById('transactions-table-body');
        if (!tbody) return;

        tbody.innerHTML = transactions.map(txn => {
            const user = this.data.users.find(u => u.id === txn.user_id);
            return `
                <tr>
                    <td>${txn.id}</td>
                    <td>${user ? user.name : 'Unknown'}</td>
                    <td>${txn.type}</td>
                    <td>₹${txn.amount}</td>
                    <td>₹${txn.cashback}</td>
                    <td><span class="status status--${txn.status === 'success' ? 'success' : txn.status === 'pending' ? 'warning' : 'error'}">${txn.status}</span></td>
                    <td>${txn.date}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn--outline btn--sm" onclick="app.viewTransaction(${txn.id})">View</button>
                            ${txn.status === 'pending' ? '<button class="btn btn--primary btn--sm" onclick="app.approveTransaction(' + txn.id + ')">Approve</button>' : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Modal Functions
    closeRechargeModal() {
        document.getElementById('recharge-modal').classList.remove('active');
        this.resetRechargeForm();
    }

    closePaymentModal() {
        document.getElementById('payment-modal').classList.remove('active');
        this.selectedPaymentMethod = null;
    }

    closeSuccessModal() {
        document.getElementById('success-modal').classList.remove('active');
        this.currentTransaction = null;
        this.selectedService = null;
        this.selectedPaymentMethod = null;
    }

    resetRechargeForm() {
        document.getElementById('recharge-number').value = '';
        document.getElementById('recharge-operator').value = '';
        document.getElementById('recharge-amount').value = '';
        document.getElementById('cashback-amount').textContent = '0';
        document.querySelectorAll('.amount-button').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    // Additional Functions
    showAddMoney() {
        this.showToast('Add money feature coming soon!', 'info');
    }

    showWalletHistory() {
        this.showToast('Wallet history feature coming soon!', 'info');
    }

    shareReferral() {
        const referralCode = 'REF' + (this.currentUser ? this.currentUser.id.toString().padStart(5, '0') : '12345');
        const message = `Join PayEasy and get ₹50 bonus! Use my referral code: ${referralCode}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'PayEasy Referral',
                text: message
            });
        } else {
            navigator.clipboard.writeText(message).then(() => {
                this.showToast('Referral message copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Unable to copy to clipboard', 'error');
            });
        }
    }

    // Action functions
    viewUser(id) { 
        this.showToast(`Viewing user ${id}`, 'info'); 
    }
    
    editUser(id) { 
        this.showToast(`Editing user ${id}`, 'info'); 
    }
    
    viewTransaction(id) { 
        this.showToast(`Viewing transaction ${id}`, 'info'); 
    }
    
    approveTransaction(id) { 
        this.showToast(`Transaction ${id} approved!`, 'success');
        const txn = this.data.transactions.find(t => t.id === id);
        if (txn) {
            txn.status = 'success';
            this.loadTransactionsTable();
        }
    }

    // Export Functions
    exportUsers() {
        const csvContent = "data:text/csv;charset=utf-8," + 
            "ID,Name,Mobile,Email,Wallet Balance,KYC Status,Status\n" +
            this.data.users.map(user => 
                `${user.id},${user.name},${user.mobile},${user.email},${user.wallet_balance},${user.kyc_status},${user.status}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Users data exported successfully!', 'success');
    }

    exportTransactions() {
        const csvContent = "data:text/csv;charset=utf-8," + 
            "ID,User ID,Type,Operator,Amount,Cashback,Status,Date\n" +
            this.data.transactions.map(txn => 
                `${txn.id},${txn.user_id},${txn.type},${txn.operator},${txn.amount},${txn.cashback},${txn.status},${txn.date}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Transactions data exported successfully!', 'success');
    }

    // Utility Functions
    initOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<div>${message}</div>`;

        const container = document.getElementById('toast-container');
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize the app
let app;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    app = new PayEasyApp();
    app.init();
    
    // Make app globally available
    window.app = app;
});

// Global functions for onclick handlers in HTML
function showLogin() { 
    if (app) app.showLogin(); 
}

function showRegister() { 
    if (app) app.showRegister(); 
}

function showAdminLogin() { 
    if (app) app.showAdminLogin(); 
}

function login() { 
    if (app) app.login(); 
}

function register() { 
    if (app) app.register(); 
}

function adminLogin() { 
    if (app) app.adminLogin(); 
}

function verifyOTP() { 
    if (app) app.verifyOTP(); 
}

function resendOTP() { 
    if (app) app.resendOTP(); 
}

function logout() { 
    if (app) app.logout(); 
}

function adminLogout() { 
    if (app) app.adminLogout(); 
}

function showRecharge(type) { 
    if (app) app.showRecharge(type); 
}

function proceedToPayment() { 
    if (app) app.proceedToPayment(); 
}

function selectPaymentMethod(method) { 
    if (app) app.selectPaymentMethod(method); 
}

function processPayment() { 
    if (app) app.processPayment(); 
}

function closeRechargeModal() { 
    if (app) app.closeRechargeModal(); 
}

function closePaymentModal() { 
    if (app) app.closePaymentModal(); 
}

function closeSuccessModal() { 
    if (app) app.closeSuccessModal(); 
}

function showProfile() { 
    if (app) app.showToast('Profile page coming soon!', 'info'); 
}

function showAddMoney() { 
    if (app) app.showAddMoney(); 
}

function showWalletHistory() { 
    if (app) app.showWalletHistory(); 
}

function showAllTransactions() { 
    if (app) app.showToast('All transactions page coming soon!', 'info'); 
}

function shareReferral() { 
    if (app) app.shareReferral(); 
}

function showDashboard() { 
    if (app) {
        // Update bottom nav
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }
    }
}

function showTransactions() { 
    if (app) app.showToast('Transactions page coming soon!', 'info'); 
}

function showOffers() { 
    if (app) app.showToast('Offers page coming soon!', 'info'); 
}

function showSupport() { 
    if (app) app.showToast('Support page coming soon!', 'info'); 
}

function showAdminOverview() { 
    if (app) app.showAdminOverview(); 
}

function showUserManagement() { 
    if (app) app.showUserManagement(); 
}

function showTransactionManagement() { 
    if (app) app.showTransactionManagement(); 
}

function showServiceManagement() { 
    if (app) app.showToast('Service management coming soon!', 'info'); 
}

function showOffersManagement() { 
    if (app) app.showToast('Offers management coming soon!', 'info'); 
}

function showReports() { 
    if (app) app.showToast('Reports section coming soon!', 'info'); 
}

function exportUsers() { 
    if (app) app.exportUsers(); 
}

function exportTransactions() { 
    if (app) app.exportTransactions(); 
}