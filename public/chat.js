const socket = io()

let sendMessage = document.getElementById('sendMessage')
let history = document.getElementById('history')
let chatBox = document.getElementById('chatBox')
let user;


let cargarDatos = async (data) => {
    console.log(data)
    let messages = ""   
    if (data.chat && data.chat.length > 0) {
        await data.chat.map(item => {
            let photoUser = item.user?.photo ? `/database/uploads/${item.user.photo}` : "/database/predeterminados/avatar.jpg"
            messages += `
            <div class="message-container">
                <img src="${photoUser}" alt="user image"/>
                <div>
                    <div class="message-title">   
                        <span class="username">${item.user.username}</span><span class="timestamp"> ${item.timestamp} </span>
                    </div>
                    <div class="message-item">
                        <span class="message">${item.message}</span>
                    </div>
                </div>
            </div>`
        })
        return messages
    }
}

socket.on('history', async data => {
    user = data.user
    let messages
    if (data.chat[0].timestamp) {
        messages = await cargarDatos(data)
        history.innerHTML = messages
    }
})


let cargarDato = async (data) => {
    let message = ""
    let photoUser = data.user?.photo ? `/database/uploads/${data.user.photo}` : "/database/predeterminados/avatar.jpg"
    message += `
        <div class="message-container">
            <img src="${photoUser}" alt="user image"/>
            <div>
                <div class="message-title">   
                    <span class="username">${data.user.username}</span><span class="timestamp"> ${data.timestamp} </span>
                </div>
                <div class="message-item">
                    <span class="message">${data.message}</span>
                </div>
            </div>
        </div>`
    return message
}



sendMessage.addEventListener('click', (e) => {
    e.preventDefault()
    if (chatBox.value.trim().length > 0) {
        socket.emit('message', {
            message: chatBox.value.trim(),
            user: user
        })
        chatBox.value = ""
    }
})

socket.on("newMessage", async data => {
    let message = await cargarDato(data)
    history.innerHTML += message
})