// Configure API URL
let useLocalAPI = true;

let host = 'http://139.177.103.192:8080';
let local = 'http://localhost:8080';

export let url = useLocalAPI ? local : host;
