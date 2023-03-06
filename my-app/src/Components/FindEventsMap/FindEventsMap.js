import { useState,useReducer, useEffect  } from "react";
import MapContainer from "../EventMap/EventMap.js"
import EventFilters from "../Filters/EventFilters.js"
import "./find-events-map-styles.css";


function eventsMapCard(event){
    return (
        <div className="event-map-card">
        <div>
            <p className="event-map-name">{event.name}</p>
            <p className="event-map-time">{event.date}, {event.time}</p>
            <p className="event-map-location">{event.location}</p>
            <p className="event-map-category">{event.category}</p>
            <p className="event-map-difficulty">{event.difficulty}</p>
        </div>
        <div>
            <p className="event-map-attendees">{event.attendees} participants</p>
            <button className="join-event">Join</button>
        </div>
        </div>
    )
}
function eventsListCard(event){
    return (
        <div className="event-list-card">
        <div className="crop">
            <img src="http://i.stack.imgur.com/wPh0S.jpg"/>
        </div>
        <div>
            <h1 className="event-list-name">{event.name}</h1>
            <p className="event-list-time">{event.date}, {event.time}</p>
            <p className="event-list-location">{event.location}</p>
            <p className="event-list-attendees">{event.attendees} participants</p>

        </div>
        <div>
            <p className="event-list-category">{event.category}</p>
            <p className="event-list-difficulty">{event.difficulty}</p>
        </div>
        <div>
            
            <button className="join-event">Join</button>
        </div>
        </div>
        
    )
}

function Searchbar({handleFilters}){
    return (
        <input 
        id="locationsearch"
        name="search"
        type="text"
        className="searchbar"
        placeholder="Search Location"
        onChange={(e) => handleFilters(e)}
    />
    )
}
function EventMapHeader({eventsView,setEventsView}){
    function changeView(e){
        setEventsView(e.target.id);
          };
    return (
            <div style={{ display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                <h1 style={{marginTop:"0px", position:"relative", right:"270px"}}>Filters</h1>
                <div style={{marginTop:"0px", position:"relative", left:"400px"}}>
                <button id="mapview" style={{ fontWeight: eventsView === "mapview" ? "bold" : "" }} onClick={(e)=>changeView(e)}>Map View</button>
                <button id="listview" style={{ fontWeight: eventsView === "listview" ? "bold" : "" ,marginRight:"100px"}} onClick={(e)=>changeView(e)}>List View</button>
                </div>

            </div>

    )
}
function EventsMapList({events, handleFilters}){
    return (
        <div className="events-map-list">
            <Searchbar handleFilters={handleFilters}/>
            {
                events.map((event) => eventsMapCard(event))
            }
        </div>
    )
}
function EventsListList({events, handleFilters}){
    return (
        <div className="events-list-list">
            <h1>Search Events</h1>
            <Searchbar handleFilters={handleFilters}/>
            {
                events.map((event) => eventsListCard(event))
            }
        </div>
    )
}

export default function FindEventsMap(){

    let eventsdb = [
        {
            name: "ippt training",
            date: "2023-02-05",
            time: "7pm",
            location: "tekong",
            category: "Jogging",
            difficulty: "Intermediate",
            description: " ord loh",
            attendees: 5,
            group: "tekong bois"
        },
        {
            name: "naruto run",
            date: "2023-03-01",
            time: "7pm",
            location: "tampines",
            category: "Running",
            difficulty: "Beginner",
            description: "SASUKEEEE",
            attendees: 5,
            group: "naruto bois"
        },
        {
            name: "sasuke run",
            date: "2023-02-01",
            time: "7pm",
            location: "tampines",
            category: "Running",
            difficulty: "Beginner",
            description: "SASUKEEEE",
            attendees: 5,
            group: "naruto bois"
        },
        {
            name: "zumba",
            date: "2023-02-02",
            time: "7pm",
            location: "tampines",
            category: "Other",
            difficulty: "Beginner",
            description: "dududu",
            attendees: 5,
            group: "bois"
        }
    ]

    //const [events, setEvents] = useState(eventsdb);
    const [eventsView, setEventsView] = useState("mapview");
    let events = eventsdb;
    const [filters, setFilters] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            search: "",
            difficulty: [],
            startDate: "",
            endDate: "",
            category: [],
            groups: []
        }
      );
      let groups =   Array.from(new Set(events.map((event)=>event.group)));

        events = (filterEvents(eventsdb, filters, eventsView));

  

    function handleFilters(event){
        const name = event.target.name;
        const newValue = event.target.value;
        if (event.target.type === "checkbox"){ // checkboxes need multiple values ie array
            if (event.target.checked){ // box checked, add to filter
                let newFiltersList = [...filters[name]];
                newFiltersList.push(newValue);
                setFilters({ [name]: newFiltersList });
            }
            else { // box unchecked, remove from filter
                let newFiltersList = [...filters[name]];
                newFiltersList = newFiltersList.filter(v => v !== newValue);
                setFilters({ [name]: newFiltersList });
            }
        }
        else {
            setFilters({ [name]: newValue });
        }
    }

    function filterEvents(events, filters, eventsView){
        let filteredEvents = events.filter((event) => {
            if (filters.difficulty.length !==0 && !(filters.difficulty.includes(event.difficulty))) return false;
            if (filters.category.length !==0 && !(filters.category.includes(event.category))) return false;
            if (filters.groups.length !==0 && !(filters.groups.includes(event.group))) return false;
            let eventDate = new Date(event.date); 
            if (filters.startDate !== ""){
                let filterStartDate = new Date(filters.startDate);
                if (eventDate < filterStartDate) return false;
            }
            if (filters.endDate !== ""){
                let filterEndDate = new Date(filters.endDate);
                if (eventDate > filterEndDate) return false;
            }
            if (eventsView==="mapview") return event.location.toLowerCase().indexOf(filters.search.toLowerCase()) !==-1;
            return event.location.toLowerCase().indexOf(filters.search.toLowerCase()) !==-1;
        })
        return filteredEvents;
    }


    return(
        <div className="find-events-page" >{/*col*/}
            <EventMapHeader eventsView={eventsView} setEventsView={setEventsView} />{/*row*/}
            {eventsView==="mapview" ?
            (<EventMapInfo groups={groups} handleFilters={handleFilters} events={events} eventsView={eventsView} setEventsView={setEventsView} />)
        : (<EventListInfo groups={groups} handleFilters={handleFilters} events={events} eventsView={eventsView} setEventsView={setEventsView} />)}
        </div>

    )
}

function EventMapInfo({groups, handleFilters, events, eventsView, setEventsView}){
    return (
        <div className="event-map-info">
        <EventFilters groups={groups} handleFilters={handleFilters}/>
        <MapContainer />
        <EventsMapList events={events} eventsView={eventsView} setEventsView={setEventsView} handleFilters={handleFilters}/>    
    </div>
    )
}

function EventListInfo({groups, handleFilters, events, eventsView, setEventsView}){
    return (
        <div className="event-list-info">
        <EventFilters groups={groups} handleFilters={handleFilters}/>
        <EventsListList events={events} eventsView={eventsView} setEventsView={setEventsView} handleFilters={handleFilters}/>    
    </div>
    )
}