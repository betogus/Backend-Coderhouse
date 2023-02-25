let productForm = document.getElementById('productForm')
const handleSubmit = (evt, form, route) => {
    evt.preventDefault()
    let formData = new FormData(form) 
    let obj = {}
    formData.forEach((value, key) => obj[key] = value)
    fetch(route, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

usersForm.addEventListener('submit', (e) => handleSubmit(e, e.target, '/api/productos'))
