// @flow

import React, { Component } from 'react';

import { Watermarks } from '../../base/react';
import { connect } from '../../base/redux';
import { setColorAlpha } from '../../base/util';
import { fetchCustomBrandingData } from '../../dynamic-branding';
import { SharedVideo } from '../../shared-video/components/web';
import { Captions } from '../../subtitles/';
import Iframe from 'react-iframe';
import UIEvents from '../../../../service/UI/UIEvents';
declare var interfaceConfig: Object;
var Board = (interfaceConfig.Borad_url) ? interfaceConfig.Borad_url : 'https://meet.ourtrial.com/whiteboard/';

type Props = {

    /**
     * The alpha(opacity) of the background
     */
    _backgroundAlpha: number,

    /**
     * The user selected background color.
     */
     _customBackgroundColor: string,

    /**
     * The user selected background image url.
     */
     _customBackgroundImageUrl: string,

    /**
     * Fetches the branding data.
     */
    _fetchCustomBrandingData: Function,

    /**
     * Prop that indicates whether the chat is open.
     */
    _isChatOpen: boolean,

    /**
     * Used to determine the value of the autoplay attribute of the underlying
     * video element.
     */
    _noAutoPlayVideo: boolean
}

/**
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * the conference participant who is on the local stage) on Web/React.
 *
 * @extends Component
 */
class LargeVideo extends Component<Props> {
    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
     constructor(props) {
        super(props);
        this.state = {
          //   items: [
          //     {id: 1, name: 'Mountains',desc:'Lorem ipsum dolor..',image_src:'../images/tool_images/mountains.jpg',category:'Edge Case'},
          //     {id: 2, name: 'Lights',desc:'Lorem ipsum dolor..',image_src:'../images/tool_images/lights.jpg',category:'Edge Case'},
          //     {id: 3, name: 'Forest',desc:'Lorem ipsum dolor..',image_src:'../images/tool_images/nature.jpg',category:'Edge Case'},
          //     {id: 4, name: 'Retro',desc:'Lorem ipsum dolor..',image_src:'../images/tool_images/cars1.jpg',category:'cars'},
          //     {id: 5, name: 'Fast',desc:'Lorem ipsum dolor..',image_src:'../images/tool_images/cars2.jpg',category:'cars'},
          //     {id: 6, name: 'Classic',desc:'Lorem ipsum dolor..',image_src:'../images/tool_images/cars3.jpg',category:'cars'},
          //     {id: 7, name: 'Girl',desc:'Lorem ipsum dolor..',image_src:'../images/tool_images/people1.jpg',category:'Nature'},
          //     {id: 8, name: 'Man',desc:'Lorem ipsum dolor..',image_src:'../images/tool_images/people2.jpg',category:'people'},
          //     {id: 9, name: 'Woman',desc:'Lorem ipsum dolor..',image_src:'../images/tool_images/people3.jpg',category:'people'},
          // ],
          selecteitems: [],
          users:[],
          selectedBoard:"Main Board",
          totalMain:1
        };
    }
    reload_iframes() {
        var f_list = document.getElementsByTagName('iframe');
     
        for (var i = 0, f; f = f_list[i]; i++) {
            f.src = f.src;
        }
    }
    componentDidMount() {
        if(this._isvisible()) {
            // var btnContainer = document.getElementById("myBtnContainer");
            // var btns = btnContainer.getElementsByClassName("btn");
            // for (var i = 0; i < btns.length; i++) {
            //     btns[i].addEventListener("click", function(){
            //         var current = document.getElementsByClassName("active");
            //         current[0].className = current[0].className.replace(" active", "");
            //         this.className += " active";
            //     });
            // }
            // this.filterSelection('all');
            // this.getCategory();
            // this.getImages();
        }
        APP.UI.addListener(UIEvents.BOARD_ARRAY, (messageObj) => { 
            console.log(messageObj);
            this.setState({selecteitems:messageObj});
            this.setState({users:APP.store.getState()['features/base/participants']});
          
            

                
        });
        // if(APP.conference._room !== undefined) {
        //     APP.conference._room.addCommandListener(
        //     '_boardsArray',
        //     ({ value, attributes }, id) => {
        //         alert('here');
        //         console.log(JSON.parse(value));
        //     // if(!APP.conference.isLocalId(id)) {
        //         this.setState({selecteitems:value});
        //         //}
            
        //     }
        //     );
        // }
        // if(APP.conference._room !== undefined) {
        //     APP.conference._room.on('conference.messageReceived', (id, text) => {
        //              alert();
               
        //     });
        // }
        this.props._fetchCustomBrandingData();
       
    }

    _isvisible() {
        const Prole = APP.store.getState()['features/base/participants'][0].role;
  
        return Prole === 'moderator';
    }
    renderItemIframes = (item, index) => {
      
        console.log("itemitemitemitemitemitem");
        console.log(this._isvisible());
        var splitname = item.split("-");
        var c = '';
        if(splitname[2] !== undefined){
            c = '-'+splitname[2];
        }
        if(APP.store.getState()['features/base/participants'][0].role == "moderator") {
           
            console.log('moderator');
            return (
                <Iframe
                className="whiteboardframe"
                key={item}
                allowFullScreen = { true }
                display = 'initial'
                height = '100%'
                id = {'myId-'+splitname[1]+c}
                position = 'relative'
                url = {Board+item}
                width = '100%' />
            )
        } else {
            console.log('participant');
            console.log(item+' ->>>>>participant-'+APP.conference.getMyUserId());
            if(item.includes('main')) {
                return (
                    <Iframe
                    className="whiteboardframe"
                    styles={{display:'none'}}
                    key={item}
                    allowFullScreen = { true }
                    display = 'initial'
                    height = '100%'
                    id = {'myId-'+splitname[1]+c}
                    position = 'relative'
                    url = {Board+item}
                    width = '100%' />
                )
            } else if(item == 'participant-'+APP.conference.getMyUserId()){
                console.log('participant');
               
                return (
                    <Iframe
                    className="whiteboardframe"
                    styles={{display:'none'}}
                    key={item}
                    allowFullScreen = { true }
                    display = 'initial'
                    height = '100%'
                    id = {'myId-'+splitname[1]}
                    position = 'relative'
                    url = {Board+item}
                    width = '100%' />
                )
            } 
        }
        //$('#myId-'+splitname[1]).attr('src', $('#myId-'+splitname[1]).attr('src'));
    }
      renderItemdropdown = (item, index) => {
        var splitname = item.split("-");
        //console.log(APP.conference._room.participants[splitname[1]]._displayName)
       
        if(item.includes('main')) {
            var itemN = item.split("-");
            if(itemN[2] !== undefined){
                return <li data-id={item} data-name={'Main Board '+itemN[2]} onClick={this.selectBoard} className={'changeboard'}>{ 'Main Board-'+itemN[2]} </li>
            } else{
                return <li data-id={item} data-name={'Main Board'} onClick={this.selectBoard} className={'changeboard'}>Main Board</li>
            }
            
        } else {
            console.log(splitname);
            var name = APP.conference.getParticipantDisplayName(splitname[1]);
            console.log(name);
            if(APP.store.getState()['features/base/participants'][0].role == "moderator") {
                return <li data-id={item} data-name={name} onClick={this.selectBoard} className={'changeboard'}>{name}</li>
            } else {
                if(item == 'participant-'+APP.conference.getMyUserId()){
                    return <li data-id={item} data-name={"My Board"} onClick={this.selectBoard} className={'changeboard'}>My Board</li>
                }
            }
            
        }
        
    }
    selectBoard = (e) => {
        console.log(e.target.getAttribute("data-id"));
        var d = e.target.getAttribute("data-id");
        var splitname = d.split("-");
        var dn = e.target.getAttribute("data-name");
        $('#white-board').children('iframe').hide();
        //APP.conference.loadIframe('myId-'+splitname[1],'https://meet.ourtrial.com/whiteboard/'+d);
        if(splitname[2]!==undefined){
            $('#myId-'+splitname[1]+'-'+splitname[2]).show();
        } else {
            $('#myId-'+splitname[1]).show();
        }
        
        this.setState({selectedBoard:dn})
    }
    addMainBoard = (e) => {
        this.setState({totalMain:this.state.totalMain+1});
        APP.conference._addBoards('main','addnewMain',this.state.totalMain);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render() {
        const {
            _isChatOpen,
            _noAutoPlayVideo
        } = this.props;
        const style = this._getCustomSyles();
        const className = `videocontainer${_isChatOpen ? ' shift-right' : ''}`;

        return (
            <div
                className = { className }
                id = 'largeVideoContainer'
                style = { style }>
                <SharedVideo />
                <div id = 'etherpad' />
                <div
                    className = 'white-board'
                    id = 'white-board'>
                    <div className="whiteboard-list dropdown">
                     {this.state.selectedBoard}
                      <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAA50lEQVRoge3YzQqCQABF4dMbWhQt6umLoOjnBQpsYRdCZsTKcUa6H7gb5R5cKZiZmZmZfWgFXIADUGXeEjIHjsANWMcOzYAzUL+ue9fhDNY0m7TvSrM56PR2sKSYdkRNszVqEbghd0wo4k6ztdMycOMD2KZa2mEV2bLp+4ASYn6OkJwxg0VIjpjBI2TMmGQRMkZM8ghJGTNahKSIGT1ChozJFiFDxGSPkF9iiomQb2KKi5BPYoqNkD4xxUdIV8xkIiT27VDaN04voTczmTfRFouZVIS0YyYZIRWwB3aU+XvJzMzMzP7JE9nJ7S6cU2ClAAAAAElFTkSuQmCC' />
                      <div className="dropdown-content">
                        <ul>
                        {APP.store.getState()['features/base/participants'].map((data) =>{

                        })}
                        {this.state.selecteitems.map(this.renderItemdropdown)}
                            {/* <li className="active">Whiteboard 1</li>
                            <li>Whiteboard 2</li>
                            <li>Whiteboard 3</li>
                            <li>Whiteboard 4</li> */}
                            <li>
                            {APP.store.getState()['features/base/participants'][0].role == "moderator" && 
                                <button onClick={this.addMainBoard} className="btn">Add New Board</button>
                            }
                             
                            </li>
                        </ul>
                      </div>
                    </div>
                    {/* <Iframe
                        allowFullScreen = { true }
                        display = 'initial'
                        height = '100%'
                        id = 'myId'
                        position = 'relative'
                        url = { 'https://meet.ourtrial.com/whiteboard/'+APP.conference.roomName+'-MainBoard1'}
                        width = '100%' /> */}
                    {this.state.selecteitems.map(this.renderItemIframes)}
                </div>
                <Watermarks />

                <div id = 'dominantSpeaker'>
                    <div className = 'dynamic-shadow' />
                    <div id = 'dominantSpeakerAvatarContainer' />
                </div>
                <div id = 'remotePresenceMessage' />
                <span id = 'remoteConnectionMessage' />
                <div id = 'largeVideoElementsContainer'>
                    <div id = 'largeVideoBackgroundContainer' />

                    {/*
                      * FIXME: the architecture of elements related to the large
                      * video and the naming. The background is not part of
                      * largeVideoWrapper because we are controlling the size of
                      * the video through largeVideoWrapper. That's why we need
                      * another container for the background and the
                      * largeVideoWrapper in order to hide/show them.
                      */}
                    <div
                        id = 'largeVideoWrapper'
                        role = 'figure' >
                        <video
                            autoPlay = { !_noAutoPlayVideo }
                            id = 'largeVideo'
                            muted = { true }
                            playsInline = { true } /* for Safari on iOS to work */ />
                    </div>
                </div>
                { interfaceConfig.DISABLE_TRANSCRIPTION_SUBTITLES
                    || <Captions /> }
            </div>
        );
    }

    /**
     * Creates the custom styles object.
     *
     * @private
     * @returns {Object}
     */
    _getCustomSyles() {
        const styles = {};
        const { _customBackgroundColor, _customBackgroundImageUrl } = this.props;

        styles.backgroundColor = _customBackgroundColor || interfaceConfig.DEFAULT_BACKGROUND;

        if (this.props._backgroundAlpha !== undefined) {
            const alphaColor = setColorAlpha(styles.backgroundColor, this.props._backgroundAlpha);

            styles.backgroundColor = alphaColor;
        }

        if (_customBackgroundImageUrl) {
            styles.backgroundImage = `url(${_customBackgroundImageUrl})`;
            styles.backgroundSize = 'cover';
        }

        return styles;
    }
}


/**
 * Maps (parts of) the Redux state to the associated LargeVideo props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const testingConfig = state['features/base/config'].testing;
    const { backgroundColor, backgroundImageUrl } = state['features/dynamic-branding'];
    const { isOpen: isChatOpen } = state['features/chat'];

    return {
        _backgroundAlpha: state['features/base/config'].backgroundAlpha,
        _customBackgroundColor: backgroundColor,
        _customBackgroundImageUrl: backgroundImageUrl,
        _isChatOpen: isChatOpen,
        _noAutoPlayVideo: testingConfig?.noAutoPlayVideo
    };
}

const _mapDispatchToProps = {
    _fetchCustomBrandingData: fetchCustomBrandingData
};

export default connect(_mapStateToProps, _mapDispatchToProps)(LargeVideo);
