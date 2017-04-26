import React from 'react';

export default class Task extends React.Component {
    constructor(props){
        super(props);

        this.state ={
        };

    }


    render() {
       const { item } = this.props;
       console.log("item",item)
        return (
            <div className="modalView row-fluid" >
                <div className="modalContainer">
                    <div className="close" onClick={()=>{this.props.closeModal()}}>
                        x
                    </div>
                    <h2>{item.name}</h2>
                    <h4><a href={item.url} target="blank">{item.url}</a></h4>
    
                    <p>{item.text}</p>
                </div>
           </div>
        )
    }
}

