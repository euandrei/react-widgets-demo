import React from 'react';
import ReactPlayer from 'react-player';

import RangeUI from './RangeUI.jsx'

export default class VideoIndex extends React.Component {
    constructor(props){
        super(props);
         this.state = {
            url: null,
            playing: true,
            volume: 0.8,
            played: 0,
            loaded: 0,
            duration: 0,
            playbackRate: 1.0
         }
         this.load = this.load.bind(this); 
         this.playPause = this.playPause.bind(this); 
         this.stop = this.stop.bind(this); 
         this.setVolume = this.setVolume.bind(this); 
         this.setPlaybackRate = this.setPlaybackRate.bind(this); 
         this.onSeekMouseDown = this.onSeekMouseDown.bind(this); 
         this.onSeekChange = this.onSeekChange.bind(this); 
         this.onSeekMouseUp = this.onSeekMouseUp.bind(this); 
         
         this.onProgress = this.onProgress.bind(this); 
         this.onConfigSubmit = this.onConfigSubmit.bind(this); 
         this.renderLoadButton = this.renderLoadButton.bind(this); 
         
         this.onSeekMouseDownSlider = this.onSeekMouseDownSlider.bind(this); 
         this.onSeekChangeSlider = this.onSeekChangeSlider.bind(this); 
         this.onSeekMouseUpSlider = this.onSeekMouseUpSlider.bind(this);
         this.addNewInterval = this.addNewInterval.bind(this);
         this.deleteInterval = this.deleteInterval.bind(this);
    }
    componentWillMount(){
      let intervals = [];
      this.setState({
        intervals: intervals,
      })
    }
   
  load(url) {
    this.setState({
      url,
      played: 0,
      loaded: 0
    })
  }
  playPause() {
    this.setState({ playing: !this.state.playing })
  }
  stop() {
    this.setState({ url: null, playing: false })
  }
  setVolume(e) {
    this.setState({ volume: parseFloat(e.target.value) })
  }
  setPlaybackRate(e) {
    console.log(parseFloat(e.target.value))
    this.setState({ playbackRate: parseFloat(e.target.value) })
  }
  
  onSeekMouseDown(e){
    this.setState({ seeking: true })
  }
  onSeekChange(e){
    console.log("seek",parseFloat(e.target.value));
    this.setState({ played: parseFloat(e.target.value) })
  }
  onSeekMouseUp (e){
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }
  // new slider
  onSeekMouseDownSlider(e){
    this.setState({ seeking: true })
  }
  onSeekChangeSlider(e){
    console.log("seek Slider",parseFloat(e));
    this.setState({ played: parseFloat(e) })
  }
  onSeekMouseUpSlider(e){
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e))
  }
  // end new slider
  onProgress(state){
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  
  onConfigSubmit (){
    let config
    try {
      config = JSON.parse(this.configInput.value)
    } catch (error) {
      config = {}
      console.error('Error setting config:', error)
    }
    this.setState(config)
  }
  renderLoadButton(url, label) {
    return (
      <button onClick={() => this.load(url)}>
        {label}
      </button>
    )
  }
  // SLIDER FUNCTIONS
  onSeekMouseDownSlider(){
    this.setState({ seeking: true })
  }
  onSeekChangeSlider(value, position, id){
    this.setState({ played: parseFloat(value) })
  }
  onSeekMouseUpSlider(value, position, id){
    console.log("vpi", value,position,id)
    let intervals = this.state.intervals;
    if(position == 0){
      intervals[id - 1].firstMarker = value;
    }
    else if(position == 1){
      intervals[id - 1].secondMarker = value;
    }
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(value))
  }
  addNewInterval(newInterval){
    let intervals = this.state.intervals;
    intervals.push(newInterval);
    this.setState({
      intervals:intervals,
    })
  }
  deleteInterval(id){
    let intervals = this.state.intervals;
    intervals[id - 1].status = "closed";
    this.setState({
      intervals:intervals,
    })
  }
  
  
  // end slider
  
  
  
    render() {
        const {
      url, playing, volume,
      played, loaded, duration,
      playbackRate,
      soundcloudConfig,
      vimeoConfig,
      youtubeConfig,
      fileConfig
    } = this.state;
    const SEPARATOR = ' · '
    
        return (
            <div className="container">
                <div className='app'>
        <section className='section'>
            <h1>Insert video url</h1>
            
            <input ref={input => { this.urlInput = input }} type='text' placeholder='Enter URL' />
            <button onClick={() => this.setState({ url: this.urlInput.value })}>Load</button>
              
          <div className='player-wrapper'>
            <ReactPlayer
              ref={player => { this.player = player }}
              className='react-player'
              width='100%'
              height='100%'
              url={url}
              playing={playing}
              playbackRate={playbackRate}
              volume={volume}
              soundcloudConfig={soundcloudConfig}
              vimeoConfig={vimeoConfig}
              youtubeConfig={youtubeConfig}
              fileConfig={fileConfig}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={() => this.setState({ playing: true })}
              onPause={() => this.setState({ playing: false })}
              onBuffer={() => console.log('onBuffer')}
              onEnded={() => this.setState({ playing: false })}
              onError={e => console.log('onError', e)}
              onProgress={this.onProgress}
              onDuration={duration => this.setState({ duration })}
            />
          </div>
          
          <hr/>
          <RangeUI
            onSeekMouseDown={this.onSeekMouseDownSlider}
            onSeekChange={this.onSeekChangeSlider}
            onSeekMouseUp={this.onSeekMouseUpSlider}
            addNewInterval={this.addNewInterval}
            deleteInterval={this.deleteInterval}
          />
          <hr/>
                    
          <div id="onhandleslide_info">
          </div>
            
            
          

          <table><tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.stop}>Stop</button>
                <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={this.onClickFullscreen}>Fullscreen</button>
                <button onClick={this.setPlaybackRate} value={1}>1</button>
                <button onClick={this.setPlaybackRate} value={1.5}>1.5</button>
                <button onClick={this.setPlaybackRate} value={2}>2</button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                  
                 
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td><progress max={1} value={played} /></td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td><progress max={1} value={loaded} /></td>
            </tr>
          </tbody></table>
        </section>
        <section className='section'>
          
          <h2>State</h2>

          <table><tbody>
            <tr>
              <th>url</th>
              <td className={!url ? 'faded' : ''}>{url || 'null'}</td>
            </tr>
            <tr>
              <th>playing</th>
              <td>{playing ? 'true' : 'false'}</td>
            </tr>
            <tr>
              <th>volume</th>
              <td>{volume.toFixed(3)}</td>
            </tr>
            <tr>
              <th>played</th>
              <td>{played.toFixed(3)}</td>
            </tr>
            <tr>
              <th>loaded</th>
              <td>{loaded.toFixed(3)}</td>
            </tr>
            <tr>
              <th>duration</th>
              <td>Duration {duration}</td>
            </tr>
            <tr>
              <th>elapsed</th>
              <td>Duration {duration * played} </td>
            </tr>
            <tr>
              <th>remaining</th>
              <td>Duration {duration * (1 - played)}</td>
            </tr>
          </tbody></table>
        </section>
       
      </div>
            </div>
        )
    }
}


