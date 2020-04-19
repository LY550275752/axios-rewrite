import axios from '../../src/index';

interface responseData<T = any> {
    code: number,
    result: T,
    message: string
}

interface User {
    name: string,
    age: number
}

function getUser<T>() {
    return axios<responseData<T>>('/extend/user')
        .then(res => res.data)
        .catch(err => console.error(err))
}


axios({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'hi'
    }
});

axios.request({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'hello'
    }
})

async function test() {
    const user = await getUser<User>()
    if (user) {
        console.log(user.result.name);
    }
}

axios.post('/extend/post', { msg: 'post' });
test();