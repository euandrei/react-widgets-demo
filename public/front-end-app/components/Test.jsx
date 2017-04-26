import React from 'react';
import axios from 'axios';


export default class Test extends React.Component {
    
    constructor(){
        super();
        this.state={
            data:null
        }
        this.handleCall = this.handleCall.bind(this);
    }
    
    handleCall(){
        
        axios.get('https://crossorigin.me/https://www.parsehub.com/api/v2/projects/tisAgFqSbuH-/last_ready_run/data?api_key=tk8hw0t_4s_-')
        .then((res,err)=>{
            if(err){
                console.log(err);
                return;
            }
            
            console.log("Success");
            console.log(res);
        })
        
    }
    
    render() {
        return (
            <div className="container">
                <a onClick={this.handleCall}> Click me</a>
            </div>
        )
    }
}

