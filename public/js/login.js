const login = async (email, password) => {
    try {
        console.log(email)
        console.log(password)

        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data: {
                email,
                password
            }
        })
        console.log(res)
    } catch (err) {
        if (err.response) {
            console.log(err.response.data); // Server responded with an error
        } else if (err.request) {
            console.log("No response received:", err.request); // Request was made but no response
        } else {
            console.log("Error setting up request:", err.message); // Something else went wrong
        }
    }
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password)
})