import React from 'react';
import Modal from './Modal.jsx';

export default class Item extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          modalOpen: false,
        };
    }
    
    
    
    render() {
        let { item } = this.props;
        return (
            <section className="item-boards-wrapper">
                <div className="item-container">
                    <div className="wrapper" onClick={()=>this.props.openModal(item)}>
                        <div className="time-text" >
                            <p className="title"> {item.name.substring(0, 60)} </p>
                            <p className="description"> {item.text.substring(0, 120)} </p>
                        </div>
                        <div className="time-since">
                            <p> {item.Time} </p>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
                
            </section>
           
        )
    }
}

