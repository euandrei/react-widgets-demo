/* global Trello
   global location
   jshint curly:true, debug:true
*/

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

export default class Task extends React.Component {
    constructor(props){
        super(props);
        this.state={
            tooltip:false,
            lookForClick: false,
            disableButton: true,
            
        }
        this.triggerTooltip = this.triggerTooltip.bind(this);
        this.completeTask = this.completeTask.bind(this);
        this.updateText = this.updateText.bind(this);
    }
    
    triggerTooltip(){
        
        if( this.props.overlay ){ 
            console.log('there is an overlay active');
            this.props.closeOverlay(); 
        }
        
        // if( !this.props.overlay ){ 
        //     console.log('there is an overlay active');
        //     this.props.closeOverlay();
        // }
            
        this.props.triggerOverlay();
        this.setState({
            tooltip:!this.state.tooltip,
            lookForClick: !this.state.lookForClick,
        });
        
    }
    componentWillMount(){
        // this.setState({
        //   tooltip: this.props.overlay, 
        // })
    }
    completeTask(){
        let greenFlag = false; let description; let descJSON; let requestMessage;
        this.props.loading(true);
        
        // GET request to get the card 
        Trello.get("/cards/"+ this.props.item.id, 
        (card) => {
            description = card.desc;
            if(card.labels.length != 0 ){
                card.labels.map((label) => {
                    // if there is any green label then do not change description or label.
                    if(label.color == "green"){
                        greenFlag = true;
                    }
                })
            }
            
            if(!greenFlag){
                let label = {  
                    value:'57b2f35a84e677fd36f2710e', 
                };
                
                // POST request to set the label
                Trello.post("/cards/"+ this.props.item.id +"/idLabels" , label , 
                (card) => {console.log("card", card);},
                (error) => {console.log("error:", error)});
                
                
                
                // Creating the json message to be added in description
                descJSON = {
                    text: this.state.text,
                    time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    user: this.props.currentUser
                } 
                requestMessage = {
                    value: `${description} \n\n ${JSON.stringify(descJSON)}`,
                }
                
                // PUT request to set the description
                Trello.put("/cards/"+ this.props.item.id +"/desc",requestMessage,
                (success) => {
                    console.log("success")
                    this.props.rerender();
                },
                (error) => {console.log("error")});
            }
          
        },
        (error) => {console.log("error:", error)});
        
    }
    
            
    updateText(e){
        
        this.setState({
            text: e.target.value,
        })
        if(e.target.value == ''){
            this.setState({
                disableButton: true,
            })
        }
        else{
            this.setState({
                disableButton: false,
            })
        }
    }
    
  componentWillMount() {
    // add event listener for clicks
    document.addEventListener('click', this.handleClick.bind(this), false);
  }

  componentWillUnmount() {
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener('click', this.handleClick.bind(this), false);
  }

 
  handleClick(e) {
    
    if(!ReactDOM.findDOMNode(this).contains(e.target) && this.state.tooltip && this.state.lookForClick) {
        this.props.triggerOverlay();
        this.setState({
            tooltip:!this.state.tooltip,
            lookForClick:!this.state.lookForClick,
        });
        let checkbox = document.querySelectorAll(".actual-check");
        checkbox.forEach((check) => {check.checked = false;})
    }
  }

   
    render() {
      const { item } = this.props;
        return (
            <div className={`content task ${this.state.tooltip ? 'border-transparent' : ''}`} >
              <div className="task-container">
                 <div className="task-checkBox">
                      <input type="checkbox" className={this.state.tooltip? 'actual-check z-index-4':'actual-check'} onChange={this.triggerTooltip} />
                  </div>
                  
                  <div className="task-title" onClick={()=>this.props.openModal(item)}>
                      <h4>{item.name}</h4>
                  </div>
                     <div id="confirm-tooltip" className={this.state.tooltip ? 'visible' :'invisible'} >
                            <div className="tooltip-container">
                                <div className="tooltip-title">
                                    <h6>Please provide written confirmation:   <a  onClick="" className={`pull-right confirm-link ${this.state.disableButton ? 'disable':''}`} onClick={ this.state.disableButton ? ()=>{} : this.completeTask }> Confirm </a>  </h6>   
                                </div>
                                
                                <div className="tooltip-content">
                                    <span className="tooltip-content-text">
                                        lorem      
                                    </span>    
                                </div>
                                <div className="tooltip-inputs">
                                    <textarea rows="4" cols="50" onChange={this.updateText}>
                                        
                                    </textarea>
                                </div>
                                
                                
                            </div>
                          </div>
                          
                  {/*<div className="person col-md-0"></div>*/}
                 <div className="clearfix"></div>
              </div>
               
            </div>
        )
    }
}

