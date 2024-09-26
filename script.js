let totalAmount = 0;
const expenseCategories = {};
const categoryColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: categoryColors,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Ensures chart remains responsive
    }
});

function updateChart() {
    console.log('Labels:', Object.keys(expenseCategories));
    console.log('Data:', Object.values(expenseCategories));

    expenseChart.data.labels = Object.keys(expenseCategories);
    expenseChart.data.datasets[0].data = Object.values(expenseCategories);
    expenseChart.update();
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

function clearError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
}

function addExpense() {
    const expenseName = document.getElementById('expenseName').value.trim();
    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
    let expenseCategory = document.getElementById('expenseCategory').value;

    clearError();

    // Custom category handling
    if (expenseCategory === 'Other') {
        expenseCategory = prompt('Please enter your custom category:').trim();
        if (!expenseCategory) {
            showError('Please enter a valid custom category.');
            return;
        }
    }

    // Validation
    if (!expenseName || isNaN(expenseAmount) || expenseAmount <= 0 || !expenseCategory) {
        showError('Please fill all fields correctly.');
        return;
    }

    // Add expense to the list
    const expenseList = document.getElementById('expenseList');
    const li = document.createElement('li');
    li.innerHTML = `${expenseName} - ₹${expenseAmount.toFixed(2)} <button onclick="deleteExpense(this, ${expenseAmount}, '${expenseCategory}')">Delete</button>`;
    expenseList.appendChild(li);

    // Update total amount
    totalAmount += expenseAmount;
    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);

    // Update category amounts
    if (expenseCategories[expenseCategory]) {
        expenseCategories[expenseCategory] += expenseAmount;
    } else {
        expenseCategories[expenseCategory] = expenseAmount;
    }

    // Update chart
    updateChart();

    // Clear input fields
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseCategory').value = '';
}

function deleteExpense(element, amount, category) {
    // Remove expense from list
    element.parentElement.remove();

    // Update total amount
    totalAmount -= amount;
    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);

    // Update category amounts
    expenseCategories[category] -= amount;
    if (expenseCategories[category] <= 0) {
        delete expenseCategories[category];
    }

    // Update chart
    updateChart();
}
