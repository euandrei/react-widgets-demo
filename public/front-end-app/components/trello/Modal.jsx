import React from 'react';

export default class Task extends React.Component {
    constructor(props){
        super(props);

        this.state ={
        };

    }


    render() {
       const { item } = this.props;
        return (
            <div className="modalView row-fluid" >
              <div className="modalContainer">
                  <div className="close" onClick={()=>{this.props.closeModal()}}>
                    x
                </div>
                <h4>{item.name}</h4>

                <p>{item.desc}</p>
             </div>
           </div>
        )
    }
}

