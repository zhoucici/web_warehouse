const model = window.model;

// 1 开发模式  2 测试模式  3 线上模式
const keyObj = {
    1:'dev',
    2:'test',
    3:"online"
}
const webUrl = {
    // 开发模式
    dev:{
        supplier:"/api", 
    },
    test:{
        supplier:"http://127.0.0.1:3000", 
    },
    // 线上模式
    online:{
        supplier:"http://supplier.eiisys.com", // 
        
    },
}


export default webUrl[keyObj[model]]
