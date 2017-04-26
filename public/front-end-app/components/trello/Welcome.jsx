/* global Trello
   global location
   jshint curly:true, debug:true
*/

import React from 'react';
import Task from './Task.jsx';
import Modal from './Modal.jsx';

import axios from 'axios'

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            update:false,
            modalOpen: false,
            modalState: '',
            finish: false,
            showInitialOption: true,
            overlay:false,
            taskList: [],
            boards: [],
        };
        this._onSelect = this._onSelect.bind(this);
        this._renderSelect = this._renderSelect.bind(this);
        
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
        this.triggerOverlay = this.triggerOverlay.bind(this);
        this.closeOverlay = this.closeOverlay.bind(this);


        this.AuthenticateTrello = this.AuthenticateTrello.bind(this);
        this.onAuthorizeSuccessful = this.onAuthorizeSuccessful.bind(this);
        this.deauthorize = this.deauthorize.bind(this);
        this.loading = this.loading.bind(this);

    }
    _onSelect(e) {
       
        // let checkbox = document.querySelectorAll(".actual-check");
        // let visible = document.querySelectorAll(".visible");
        // let border = document.querySelectorAll(".border-transparent");
        // let zIndex = document.querySelectorAll(".z-index-4");
        
        // checkbox.forEach((check) => {check.checked = false; console.log(check)}) 
       
        // visible.forEach((visible) => {visible.classList.remove("visible")})
        // visible.forEach((visible) => {visible.classList.add("invisible")})
        
        // border.forEach((border) => {border.classList.remove("border-transparent")})
        // zIndex.forEach((zIndex) => {zIndex.classList.remove("z-index-4")})
        
        
        // if(this.state.overlay) {
        //     this.setState({
        //         overlay: false,
        //     })
        // }
        
        
        let actualCards = [];
        let selectedList = e.target ? e.target.value : e;

        console.log("WOW CHANGED", selectedList);
        this.setState({
            loading: true,
        })
        // GET request to get the cards from the selected list
        Trello.get("/lists/" + selectedList + "/cards", (cards) => {
            console.log("cards", cards);
            if(cards.length != 0){
                cards.map((card)=>{

                    if(card.labels.length != 0){
                        if(card.labels[0].color != "green"){
                           actualCards.push(card);
                        } 
                    }
                    else{
                        actualCards.push(card);
                    }
                })
            }
            
            this.setState({
                taskList: actualCards,
                showInitialOption: false,
                selectedList: selectedList,
                loading: false,
            });
        });
    }
    openModal(item) {
        console.log("OK OPEN IT");
        this.setState({
            modalOpen: true,
            modalState: item,
        });
    }

    closeModal() {
        this.setState({
            modalOpen: false,
        });
    }
    componentDidMount() {
        this.AuthenticateTrello();
    
        console.log("window",window.mk_data);
        console.log(this.state.settings);

    }
    componentWillMount(){
        
        let temp = window.mk_data;
        temp.user.defaultBoard = "MK BUSINESS";
        temp.user.showDropdown = false;
        temp.user.defaultList = "MK IDEAS"  //MK IDEAS / SIGNUP LIST
        this.setState({
            settings: temp
        });
        
    }
    AuthenticateTrello() {
        // Razvan's key -> 6b80ea0e082c7df7cbad60dac9118e92
        // Klauss's key -> 5fc7dc110794f700005c029106271d50

        Trello.setKey('5fc7dc110794f700005c029106271d50');
        Trello.authorize({
            name: "Mk Business",
            type: "popup",
            interactive: true,
            expiration: "never",
            persist: true,
            success: () => {
                this.onAuthorizeSuccessful()
            },
            error: () => {
                console.log("NU MERGE")
            },
            scope: {
                write: true,
                read: true
            },
        });
    }

    onAuthorizeSuccessful() {
        let token = Trello.token();
        let boardList = [];
        
        this.setState({
            loading: true,
        });
        
        console.log("wut", token); // <- This works

        // GET request to get the logged in user
        Trello.members.get("me", (member) => {
            console.log("member name", member.fullName)
            
            this.setState({
                currentUser: member.fullName,
            })
          
            //GET request to get the bards for the logged in user
            Trello.get("members/me/boards", (boards) => {
                // console.log("boards",boards);
                boards.map((board, i) => {
                    if (!board.closed) {
                        // get request to get the listf for the specified board id
                        // console.log("board",board)
                        
                        
                        Trello.get("/boards/" + board.id + "/lists", (lists) => {
                            // console.log("list",lists);   
                                
                            board["lists"] = lists;
                            boardList.push(board);
                            
                            this.setState({
                                loading: false,
                            })
                            
                            // TODO when we get the settings default grab the default board id and name and set the list
                           
                            if(this.state.settings.user.defaultBoard && (this.state.settings.user.defaultBoard == board.name)){
                                let actualCards = [];
                                lists.map((list)=>{
                                    console.log("listlist",list)
                                    if(this.state.settings.user.defaultList && (list.name == this.state.settings.user.defaultList) ){
                                        Trello.get("/lists/" + list.id + "/cards", (cards) => {
                                            if(cards.length != 0){
                                                cards.map((card)=>{
                                
                                                    if(card.labels.length != 0){
                                                        if(card.labels[0].color != "green"){
                                                           actualCards.push(card);
                                                        } 
                                                    }
                                                    else{
                                                        actualCards.push(card);
                                                    }
                                                })
                                            }
                                            
                                            this.setState({
                                                taskList: actualCards,
                                                
                                                loading: false,
                                            });
                                        }) // END OF TRELLO>GET CARDS
                                    }
                                })
                                
                                
                            } // END OF IF DEFAULT BOARD
                        });
                    }
                });  // END BOARD MAP
                this.setState({
                    boards: boardList
                })

            });
        });
    }
            
    
    _renderSelect(){
    //CALL or What's needed //
            let boards = this.state.boards ? this.state.boards : '';
            boards ? 
                boards.sort((a,b) => {
                    
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                })
                
                :'';
                
        let defaultList = this.state.settings.user.defaultList;
        return (
            <div>
            {this.state.settings.user.showDropdown ? 
        <select name="select_projects" id="select_projects" onChange={ this._onSelect } >
            {this.state.showInitialOption ? <option value="default" key={1}>{defaultList ? defaultList : "Pick a list with tasks."}</option>:''}
           
            {boards ? 
                this.state.boards.map((board,i)=>{  
                return (
                    <optgroup label= {board.name} key={i}>
                        {board.lists.map((list,j) =>{
                            return <option value={list.id} key={j}>{list.name}</option>
                        })}
                    </optgroup>
                )
            }) : ''}
        </select>
        :''}
        </div>
        )
    }
    
    deauthorize() {
        console.log("click")
        Trello.deauthorize();
        location.reload();
    }
    
    triggerOverlay(){
        this.setState({overlay:!this.state.overlay})
    }
    closeOverlay(){
         this.setState({overlay:false});
    }
    rerenderTheList(){
        this._onSelect(this.state.selectedList);
        // a bit of javascript to reset the checkboxes
        let checkbox = document.querySelectorAll(".actual-check");
        checkbox.forEach((check) => {check.checked = false; })
    }
    loading(flag){
        if(flag){
            this.setState({
                loading: true,
            })
        }
        else{
            this.setState({
                loading: false,
            })
        }
    }
    render() {
        return (
            <section className="trello-boards-wrapper" >
        
                <div className="container no-border">
                 <div className="row-fluid top-menu-row">
                  {Trello.token() ? <a href="" onClick={()=>{this.deauthorize()}}>Deauthorize.</a> :''}
                  </div>
                
                </div>
                
                 <div className="container">
               
              
                <div className="row-fluid select-row">
                    {!Trello.token()  ? <a href="#" onClick={()=>{this.AuthenticateTrello()}}>Click here to authorize.</a> : 
                        this._renderSelect()
                    }
                </div>
              
                
                   
                <div className="row tasks-row">
                  <div id='overlay' className={this.state.overlay ? 'visible':'invisible'}> </div>
                  
                  <div className="col-md-12">
                     
                    {
                      this.state.taskList ?
                        this.state.taskList.map( (task,i)=> 
                        <div className="row" key={i}>
                            <div className="col-md-12">
                                <Task openModal={this.openModal} 
                                    triggerOverlay={this.triggerOverlay} 
                                    item={task}
                                    overlay={this.state.overlay}
                                    closeOverlay={this.closeOverlay}
                                    rerender = {this.rerenderTheList.bind(this)}
                                    currentUser = {this.state.currentUser}
                                    loading = {this.loading}
                                />
                             </div> 
                        </div>
                       ) : " HAVE NO TASKS -> CALL KLAUSS "
                    }
                    
                  </div>
                </div>
                { this.state.loading ? 
                    <div className="loadingOverlay">
                        Loading..
                    </div>
                    :''
                }
                {   this.state.modalOpen ?
                      <Modal
                          item={this.state.modalState}
                          closeModal={this.closeModal}
                      />
                    :''
                }
            </div>
                
                
            </section>

        )
    }
}
