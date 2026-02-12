async function testApi() {
    console.log('Testing Backend API directly...');
    const url = 'http://localhost:5000/api/tasks';

    try {
        console.log(`1. POST ${url}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                TaskName: 'API Test Test',
                Domain: 'Basic Task',
                Mode: 'Easy',
                DueDate: new Date().toISOString()
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Success! Created Task:', data);
        } else {
            console.error('   ❌ Request Failed Status:', response.status);
            const text = await response.text();
            console.error('   Response:', text);
        }

    } catch (err) {
        console.error('   ❌ Network/Fetch Error:', err.cause || err);
    }
}

testApi();
