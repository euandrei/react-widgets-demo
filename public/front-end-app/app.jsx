import React from 'react';

import {
    HashRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import Test from './components/Test.jsx'
import Welcome from './components/trello/Welcome.jsx'
import ScraperBoard from './components/scrape-board/ScraperBoard.jsx'
import Scraper from './components/scrape-board/Scraper.jsx'
import NewBoard from './components/scrape-board/NewBoard.jsx'
import VideoIndex from './components/video-manipulation/VideoIndex.jsx'

const App = () => (

    <Router>
        <div>
            <Route exact path="/" component={Welcome}/>
            <Route exact path="/trello" component={Welcome}/>
            <Route exact path="/scraper/:id" component={ScraperBoard}/>
            <Route exact path="/scraper" component={Scraper}/>
            <Route exact path="/newBoard" component={NewBoard}/>
            <Route exact path="/video" component={VideoIndex}/>
            <Route exact path="/test" component={Test}/>
        </div>
    </Router>
);

export default App;