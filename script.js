const createForm = document.getElementById('createForm');
const userList = document.getElementById('userList');

createForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (createForm.checkValidity()) {
        const formData = new FormData(createForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        fetch('https://reqres.in/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(user => {
                renderUser(user);
                createForm.reset();
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.log('Form validation failed');
    }
});

// RENDER PART
function renderUser(user) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${user.firstName}</span>
        <span>${user.lastName}</span>
        <span>${user.email}</span>
        <span>${user.id}</span>
        <button onclick="deleteUser('${user.id}')">Delete</button>
      `;
    userList.appendChild(listItem);
    saveUserData();
}


// SAVE DATAS TO LOCAL STORAGE
function saveUserData() {
    const users = Array.from(document.querySelectorAll('#userList li')).map(li => ({
        firstName: li.querySelector('span:nth-child(1)').textContent,
        lastName: li.querySelector('span:nth-child(2)').textContent,
        email: li.querySelector('span:nth-child(3)').textContent,
        id: li.querySelector('span:nth-child(4)').textContent,
    }));

    localStorage.setItem('users', JSON.stringify(users));
}

function loadUserData() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        const users = JSON.parse(savedUsers);
        users.forEach(user => renderUser(user));
    }
}


// DELETE PART
function deleteUser(userId) {
    fetch(`https://reqres.in/api/users/${userId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                const listItem = Array.from(document.querySelectorAll('#userList li')).find(li => li.textContent.includes(userId));
                if (listItem) {
                    listItem.remove();
                    console.log(`User ${userId} deleted`);

                    updateLocalStorage();
                }
            } else {
                console.error(`Error deleting user ${userId}`);
            }
        })
        .catch(error => console.error('Error:', error));
}


// UPDATE AFTER DELETE
function updateLocalStorage() {
    const users = Array.from(document.querySelectorAll('#userList li')).map(li => ({
        firstName: li.querySelector('span:nth-child(1)').textContent,
        lastName: li.querySelector('span:nth-child(2)').textContent,
        email: li.querySelector('span:nth-child(3)').textContent,
        id: li.querySelector('span:nth-child(4)').textContent,
    }));

    localStorage.setItem('users', JSON.stringify(users));
}


// SEARCH PART
function searchUsers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const users = document.querySelectorAll('#userList li');

    users.forEach(user => {
        const firstName = user.querySelector('span:nth-child(1)').textContent.toLowerCase();
        const lastName = user.querySelector('span:nth-child(2)').textContent.toLowerCase();
        const email = user.querySelector('span:nth-child(3)').textContent.toLowerCase();
        const userId = user.querySelector('span:nth-child(4)').textContent.toLowerCase();

        if (firstName.includes(searchInput) || lastName.includes(searchInput) || email.includes(searchInput) || userId.includes(searchInput)) {
            user.style.display = 'flex';
        } else {
            user.style.display = 'none';
        }
    });
}


loadUserData();