$(document).ready(function() {
    // Function to download CSV file
    function downloadCSV(data, filename) {
        const csv = convertArrayToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // For IE
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    // Function to convert array to CSV
    function convertArrayToCSV(data) {
        const header = 'Name,Email,Address,Phone No.\n';
        const csv = data.map(row => Object.values(row).join(',')).join('\n');
        return header + csv;
    }

    // Function to fetch customer data from the API
    function fetchCustomerData(callback) {
        fetch("https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/Customer/")
            .then(response => response.json())
            .then(data => {
                if (data.documents && data.documents.length > 0) {
                    const customerData = data.documents.map(doc => {
                        const fields = doc.fields;
                        const customer = {
                            Name: fields.name.stringValue || '',
                            Email: fields.email.stringValue || '',
                            Address: fields.address.stringValue || '',
                            PhoneNo: fields.mobile.integerValue || '',
                            // CreditValue: fields.credit.doubleValue || ''
                        };
                        return customer;
                    });
                    callback(customerData);
                } else {
                    console.error('No customer data found.');
                }
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
            });
    }

    // Function to fetch top 10 customers based on price from the API
    function fetchTop10Customers(callback) {
        fetch("https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/OrderDetails")
            .then(response => response.json())
            .then(data => {
                if (data.documents && data.documents.length > 0) {
                    const orders = data.documents.map(doc => {
                        const fields = doc.fields;
                        return {
                            customerId: fields["Customer ID"].stringValue || '',
                            price: parseFloat(fields.Price.integerValue) || 0
                        };
                    });

                    // Group orders by customer and calculate total price for each customer
                    const customerOrders = orders.reduce((acc, order) => {
                        if (!acc[order.customerId]) {
                            acc[order.customerId] = 0;
                        }
                        acc[order.customerId] += order.price;
                        return acc;
                    }, {});

                    // Sort customers by total price in descending order and take top 10
                    const top10Customers = Object.keys(customerOrders)
                        .sort((a, b) => customerOrders[b] - customerOrders[a])
                        .slice(0, 10);

                    // Fetch customer details for top 10 customers
                    const promises = top10Customers.map(customerId => {
                        return fetch(`https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/Customer/${customerId}`)
                            .then(response => response.json())
                            .then(customer => {
                                const fields = customer.fields;
                                return {
                                    Name: fields.name.stringValue || '',
                                    Email: fields.email.stringValue || '',
                                    Address: fields.address.stringValue || '',
                                    "Phone No.": fields.mobile.integerValue || ''
                                };
                            });
                    });

                    Promise.all(promises).then(topCustomersData => {
                        callback(topCustomersData);
                    });
                } else {
                    console.error('No order data found.');
                }
            })
            .catch(error => {
                console.error('Error fetching order data:', error);
            });
    }
     // Event listener for All Customer button
     $('#all-customer-btn').click(function() {
        fetchCustomerData(function(data) {
            downloadCSV(data, 'all_customers.csv');
        });
    });

    // Event listener for Top 10 Customer button
    $('#top-10-customer-btn').click(function() {
        fetchTop10Customers(function(data) {
            downloadCSV(data, 'top_10_customers.csv');
        });
    });
});


