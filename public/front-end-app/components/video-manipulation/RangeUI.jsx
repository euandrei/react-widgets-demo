import React from 'react';
/* global $ */
/* global Intervals */

export default class RangeUI extends React.Component {
    constructor(props){
        super(props);
         this.state = {
          
         
         }
      
    }
    
    componentDidMount(){
        let value, position, id;
        
        
        let intervals = new Intervals("#slider");
        let slider = document.querySelector('#slider');
        slider.addEventListener("mousedown",(e)=>{
            console.log("clicked");
            e.preventDefault();
            e.stopPropagation();
            
        })
        
        
        
        
        
        
        // Initialize the first interval.
        intervals.addPeriod(0,100);
        let interval = {
            status: "active",
            firstMarker: 0,
            secondMarker: 100,
            id: 1,
        }
        this.props.addNewInterval(interval);
    
        // Function that adds new intervals.
        intervals.setAddPeriodConfirmCallback( (period, callback) => {
            let interval = {
                status: "active",
                firstMarker: period.getAbscissas()[0],
                secondMarker: period.getAbscissas()[1],
                id: period.getId(),
            }
            this.props.addNewInterval(interval);
            callback(function () {
                return confirm('Add period between ' + period.getAbscissas()[0] + ' and ' + period.getAbscissas()[1]);
            }());
        });
        // Functions that deletes intervals
        intervals.setDeletePeriodConfirmCallback( (period, callback) => {
            this.props.deleteInterval(period.getId());
            callback(function () {
                return confirm('Delete period between ' + period.getAbscissas()[0] + ' and ' + period.getAbscissas()[1]);
            }());
        });
        intervals.setOnHandleMouseenterCallback( (context, period, edgeIndex) => {
            console.log("On Handle Mouseenter");
            var handlePosition = context.offset().left;
            var periodId = period.getId();
            var handleAbscissa = period.getAbscissas()[edgeIndex];
            $("#onhandlemouseenter_info").html("Last OnHandleMouseenter data:" + "<br>" + " --- x-position: " + handlePosition + " px<br>" + " --- slider value (abscissa): " + handleAbscissa + "<br>" + " --- orientation: " + (edgeIndex === 1 ? "right" : "left") + " handle<br>" + "Period id: " + periodId + "<br>");
        });
        
        // Main handlers
        
        intervals.setOnHandleSlideCallback( (context, period, edgeIndex) => {
            var handlePosition = context.offset().left;
            console.log(handlePosition,edgeIndex)
            var periodId = period.getId();
            var handleAbscissa = period.getAbscissas()[edgeIndex] / 100;
            value = handleAbscissa;
            position = edgeIndex;
            id = periodId;
            this.props.onSeekChange(value, edgeIndex, id)
            $("#onhandleslide_info").html("Last OnHandleSlide data:" + "<br>" + " --- x-position: " + handlePosition + " px<br>" + " --- slider value (abscissa): " + handleAbscissa + "<br>" + " --- orientation: " + (edgeIndex === 1 ? "right" : "left") + " handle<br>" + "Period id: " + periodId + "<br>");
            return false;
        });
        intervals.setOnBeforeHandleSlideCallback( (context, period, edgeIndex) => {
            this.props.onSeekMouseDown();
            //return false;
        });
        // Mouse up handler
        slider.addEventListener("mouseup",()=>{
            this.props.onSeekMouseUp(value, position, id);
        })
    }
   
    render(){
        return (
            <section className="slider-ui">
                   <div id="slider"></div>
                   
                   
            </section>
        )
    }
}


