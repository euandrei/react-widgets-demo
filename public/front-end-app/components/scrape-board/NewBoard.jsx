import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

export default class NewBoard extends React.Component {
    constructor(props){
        super(props);

        this.state ={
            errorMessage: '',
        };
        this.update = this.update.bind(this);
        this.submit = this.submit.bind(this);
        this.writeJson = this.writeJson.bind(this);
        this.getRun = this.getRun.bind(this);
    }

    // make api call to get the json from local file
    
    // write in the local file

	
    update(input){
        if(input.target.id == 'project'){
            this.setState({project: input.target.value});
        }
        else if(input.target.id == 'name'){
            this.setState({name: input.target.value});
        }
        else if(input.target.id == 'time'){
            this.setState({time: (input.target.value * 60000) });
        }
    }
    
    submit(){
        let scrapeInfo = {};
        // Check if all inputs have data
        if(!this.state.project){
            this.setState({errorMessage: "Project field is required"}); return;
        }
        else if(!this.state.name){
            this.setState({errorMessage: "Name field is required"}); return;
        }
        else if(!this.state.time){
            this.setState({errorMessage: "Time field is required"}); return;
        } 
        
        // Api call to get the Project Token
        axios.post('/api/project',{
            token: this.state.project
        })
        .then((response)=>{
            // Here we get the last_ready_run and call 
            console.log("project info:", response.data);
            let runToken = response.data.last_ready_run.run_token;
            console.log("we got the token");
            this.getRun(runToken);
            
        })
        .catch((error) =>{
            console.log(error);
        });
        
        return;
        
        // Useless !!! delete when you get bored of all this pointless comments
        
        // Make api call to save the input data
        // axios.post('/api/data',{
        //     token: this.state.project,
        // })
        // .then( (scrape) => {
        //     axios.get('/api/settings')
        //     .then( (response) => {
        //         scrapeInfo = response.data;
        //         scrapeInfo[this.state.project] = {};
        //         scrapeInfo[this.state.project].data = scrape.data;
        //         scrapeInfo[this.state.project].name = this.state.name;
        //         scrapeInfo[this.state.project].time = this.state.time;
                
        //         console.log("info",scrapeInfo)
        //         axios.post('/api/settings',{
        //             settings: JSON.stringify( scrapeInfo )
        //         })
        //         .then( (response)  => {
        //             console.log("im here",response);
        //         })
        //         .catch( (error) => {
        //             console.log("error", error);
        //         });
                
        //     })
        //     .catch( (error) => {
        //         console.log("error", error);
        //     });
      
           
            
            
        // })
        // .catch( (error) => {
        //     console.log("error", error);
        // });
        
        // Redirect to main page.
        console.log("working");
        this.props.history.push("/scraper");
    }
    
    getRun(runToken){
        console.log("run", runToken);
        axios.post('/api/get_run',{
            token: runToken,
        })
        .then((response) => {
            console.log("we go something:", response);
            // Awesome now we harvest all informations you need from the run
            // end_time , start_time , status
            this.setState({runInfo: JSON.stringify(response.data)})
            console.log("token:", runToken);
            // Api call to get the data from the run
            axios.post('/api/get_run_data', {
                token: runToken,
            })
            .then((runData) => {
                console.log("we got the data:", runData);
                // Great now we got all the info
                this.writeJson(runData.data)
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
                    console.log("im here",response);
                })
                .catch( (error) => {
                    console.log("error", error);
                });
                
            })
            .catch( (error) => {
                console.log("error", error);
            });
    }

    
    render() {
        
        return (
            <div className="scrape-wrapper" >
                <div className="container">
                    <div className="add-form">
                        <h4 className="title-text">Complete the following</h4>
                        <div className="error">
                            <p> {this.state.errorMessage ? this.state.errorMessage : ''} </p>
                        </div>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Project Token:</td>
                                    <td><input type="text" placeholder="Project Token" id="project" onChange={this.update}/></td>
                                </tr>
                                <tr>
                                    <td>Name:</td>
                                    <td><input type="text" placeholder="Name" id="name" onChange={this.update}/></td>
                                </tr>
                                <tr className="last-row">
                                    <td>Time:</td>
                                    <td><input type="text" placeholder="Minutes" id="time" onChange={this.update}/></td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <a className="submit" onClick={this.submit}>Submit</a>
                        <div className="clearfix"></div>
                    </div>
                </div>
           </div>
        )
    }
}

