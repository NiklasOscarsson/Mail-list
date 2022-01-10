const app = Vue.createApp({
    data(){
        return {
            isAdmin: false,
            students: [
                {name: 'Bobian Karlsson', student_mail: 'Blob.bob@bob.com', guardian: 'Niklas Oscarsson', guardian_mail:'Niklas.Oscarsson@gmail.com', id:1},
            ]
        }
    },
    methods: {
        parseCookie(cookies){
            if(cookies[0] === "") return false
            let tokens = {}
            for(i = 0; i < cookies.length; i++){
                cookies[i] = cookies[i].split('=')
            }
            for(i = 0; i < cookies.length; i++){
                const tokenName = cookies[i][0].trim()
                tokens[tokenName] = cookies[i][1]
            }
            return tokens
        }
    },
    mounted(){
        let cookies = document.cookie.split(';')
        let token = this.parseCookie(cookies)
        if(token.token){
            fetch('/isAdmin', {
                headers: {
                    'content-type':'application/json'
                },
                body: JSON.stringify(token),
                credentials: 'same-origin',
                method: 'POST'
            })
            .then(r => {
                r.json().then(r => {this.isAdmin = r});
            })
        }
    }
})

app.mount('#app')