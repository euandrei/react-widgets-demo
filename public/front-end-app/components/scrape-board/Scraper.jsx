import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Scraper extends React.Component {
    constructor(props){
        super(props);

        this.state ={
            boardList: {}
        };
        this.writeJson = this.writeJson.bind(this);
    }

    // make api call to get the json from local file
    componentWillMount(){
        axios.get('/api/settings')
        .then( (response) => {
            console.log("json",response.data);
            this.setState({boardList: response.data})
        })
        .catch( (error) => {
            console.log("error", error);
        });
    }
    
    writeJson(json){
        let test = {
        }
        axios.post('/api/settings',{
            settings: JSON.stringify(test)
        })
        .then( (response) => {
            console.log("json",response);
        })
        .catch( (error) => {
            console.log("error", error);
        });
    }
    
    render() {
        return (
            <div className="scrape-wrapper" >
                <div className="container">
                    <div className="show-scrape-list">
                        {Object.keys(this.state.boardList).map((board,id)=>{
                            return(
                                <div className="show-scrape-board" key={id}>
                                    <Link to={`/scraper/${board}`}>{this.state.boardList[board].name}</Link>
                                </div>
                            )
                        })}
                    </div>
                
                    <div className="add-new">
                        <a onClick={this.writeJson}> !!! RESET THE LOCAL FILE !!! </a>
                        <Link to={`/newBoard`}><label className="add-button">+</label></Link>
                    </div>
                </div>
           </div>
        )
    }
}

