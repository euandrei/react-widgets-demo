import React from 'react';
import Modal from './Modal.jsx';
import Item from './Item.jsx';
import axios from 'axios';
import moment from 'moment';

import _ from 'lodash';
// var diff = require('deep-diff').diff;

export default class ScraperBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          modalOpen: false,
          boardReady: false,
          board: {},
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
        this.startTimer = this.startTimer.bind(this);
        this.getNewData = this.getNewData.bind(this);
        this.writeJson = this.writeJson.bind(this);
    }
    openModal(item) {
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
    componentWillMount(){
      let time;
      const token = window.location.href.split('/').pop();
      
      // Call to get the data from locale storage
      axios.get('/api/settings')
        .then( (response) => {
            console.log("locale", response.data[token]);
            
            time = response.data[token].refreshTime; 
            
            this.setState({
              boardReady:true,
              board: response.data[token].data,
              project: token,
              time: time,
              name: response.data[token].name,
            })
            this.startTimer(time,token);
        })
        .catch( (error) => {
            console.log("error", error);
        });

   // fiecare proiect in jsonul nostru are: id, time ( la ultimul rulaj al scraperului ) , token, last_run_token 
   
   // la fiecare x minute checkuiesti proiectul de la aceia.
   
   // in momentul in care vezi ca last run NU este RUNNING ->
     
   
   // iei timpul la care s-a terminat , run tokenul , tokenul ce-ti mai trebuie de acolo. 
          // Stochezi local aceste date.
         
          
      // daca timpul la care s-a terminat este diferit de ce ai tu local 
            // faci un call sa iei datele din ultimul run. 
            // downloadezi datele , le compari , si le stochezi corespunzator
            // diferentele le stochezi intr-o propietate separata a obiectului proiectului
     
     // daca timpul la care s-a temrinat este lafel cu ultimul tau timp stocat atunci inseamna ca nu faci nimic
  
  
  
  // daca este RUNNING -> nu faci nimic
    }
    
    startTimer(time,token){
      let timer = window.setInterval( () => {
        // Call to get the data from locale storage
        // Check if the timeNow - lastUpdate < 5 min
        axios.get('/api/settings')
          .then( (response) => {
              console.log("get new locale:", response.data[token]);
              // Set the time now and get the last update time
              let now = moment();
              let lastUpdate = moment(response.data[token].lastUpdate);
              // Check if there are more than 5 minutes since last scrape
              console.log("time dif:",parseInt(now.diff(lastUpdate, 'minutes', true),10))
              if( parseInt(now.diff(lastUpdate, 'minutes', true),10) >= 5){
                let info = JSON.parse(response.data[token].info);
                // If so check if there is a newer run finished 
                axios.post('/api/project',{
                  token:token,
                })
                .then((runInfo) =>{
                  console.log(runInfo);
                  console.log("info",info);
                  let run_end = moment(runInfo.data.last_ready_run.end_time);
                  // Check if the time from last run is newer
                  console.log("Time difference:", parseInt(run_end.diff(info.end_time, 'minutes', true),10));
                  if(parseInt(run_end.diff(info.end_time, 'minutes', true),10) > 0){
                    // If so then get the new data.
                    this.getNewData(runInfo.data.last_ready_run.run_token);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              }
          })
          .catch( (error) => {
              console.log("error", error);
          });
          
      }, time);
      // get the timer id for closing it when needed
      this.setState({timer:timer})
    }
    
    // Get new data from the server
    getNewData(runToken){
      console.log("run", runToken);
        axios.post('/api/get_run',{
            token: runToken,
        })
        .then((response) => {
            console.log("we go something:", response);
            // Awesome now we harvest all informations you need from the run
            // end_time , start_time , status
            this.setState({runInfo: JSON.stringify(response.data)});
            console.log("token:", runToken);
            // Api call to get the data from the run
            axios.post('/api/get_run_data', {
                token: runToken,
            })
            .then((runData) => {
                console.log("we got the data:", runData);
                this.setState({
                  board: runData.data,
                })
                // Great now we got all the info
                this.writeJson(runData.data);
            })
            .catch((error) => {
                console.log(error);
            });
            
        })
        .catch((error) => {
            console.log(error);
        });
      
    }
    
    // Write in the local file
    writeJson(json){
        let scrapeInfo;
        axios.get('/api/settings')
            .then( (response) => {
                scrapeInfo = response.data;
                scrapeInfo[this.state.project] = {};
                scrapeInfo[this.state.project].data = json;
                scrapeInfo[this.state.project].name = this.state.name;
                scrapeInfo[this.state.project].refreshTime = this.state.time;
                scrapeInfo[this.state.project].info = this.state.runInfo;
                scrapeInfo[this.state.project].lastUpdate = moment().format();
                
                console.log("scrapeInfo",scrapeInfo);
                axios.post('/api/settings',{
                    settings: JSON.stringify( scrapeInfo )
                })
                .then( (response)  => {
                  if(response.data.status == "success"){
                    console.log("Write success");
                  }
                  else{
                    console.log("Something went wrong");
                  }
                })
                .catch( (error) => {
                    console.log("error", error);
                });
                
            })
            .catch( (error) => {
                console.log("error", error);
            });
    }
    
    componentWillUnmount(){
      window.clearInterval(this.state.timer);
    }
    
    render() {
      let itemList = Object.keys(this.state.board);
      let items = this.state.board[itemList[0]];
        return (
          
            <section className="scrape-wrapper">
                <div className="container">
                <div className="menu border-bottom">
                  <ul>
                    <li><a>All items</a></li>
                  </ul>
                </div>
                
                {this.state.boardReady ? items.map((item,id) => {
                  return (
                    <div className="row-fluid border-bottom" key={id}>
                      <Item 
                        openModal={this.openModal}
                        item={item}
                      />
                    </div> 
                  );
                }) :''}
                  
                </div>
                
                
            {   
              this.state.modalOpen ?
                <Modal
                  item={this.state.modalState}
                  closeModal={this.closeModal}
                />
              :''
            }
            </section>
            
            
           
        );
    }
}

