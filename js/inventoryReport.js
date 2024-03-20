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
        const header = 'Category,Name,Price,Quantity\n';
        const csv = data.map(row => Object.values(row).join(',')).join('\n');
        return header + csv;
    }

    // Function to fetch inventory data from API
    function fetchInventoryData(callback) {
        fetch("https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/Inventory/")
            .then(response => response.json())
            .then(data => {
                if (data.documents && data.documents.length > 0) {
                    const inventoryData = data.documents.map(doc => {
                        const fields = doc.fields;
                        const item = {
                            Category: fields.category.stringValue || '',
                            Name: fields.name.stringValue || '',
                            Price: fields.price.doubleValue || '',
                            Quantity: fields.quantity.integerValue || ''
                        };
                        return item;
                    });
                    callback(inventoryData);
                } else {
                    console.error('No inventory data found.');
                }
            })
            .catch(error => {
                console.error('Error fetching inventory data:', error);
            });
    }

    // Event listener for Current Stock button
    $('#current-stock-btn').click(function() {
        fetchInventoryData(function(data) {
            downloadCSV(data, 'current_stock.csv');
        });
    });

    // Event listener for High Stock button
    $('#high-stock-btn').click(function() {
        fetchInventoryData(function(data) {
            const highStockData = data.filter(item => parseInt(item.Quantity) > 15);
            downloadCSV(highStockData, 'high_stock.csv');
        });
    });

    // Event listener for Low Stock button
    $('#low-stock-btn').click(function() {
        fetchInventoryData(function(data) {
            const lowStockData = data.filter(item => parseInt(item.Quantity) < 15);
            downloadCSV(lowStockData, 'low_stock.csv');
        });
    });
});
