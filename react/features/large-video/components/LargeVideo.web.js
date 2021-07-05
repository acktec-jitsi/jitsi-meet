// @flow

import React, { Component } from 'react';

import { Watermarks } from '../../base/react';
import { connect } from '../../base/redux';
import { setColorAlpha } from '../../base/util';
import { fetchCustomBrandingData } from '../../dynamic-branding';
import { SharedVideo } from '../../shared-video/components/web';
import { Captions } from '../../subtitles/';
import Iframe from 'react-iframe';
declare var interfaceConfig: Object;

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
    componentDidMount() {
        this.props._fetchCustomBrandingData();
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
                      Main Board
                      <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAA50lEQVRoge3YzQqCQABF4dMbWhQt6umLoOjnBQpsYRdCZsTKcUa6H7gb5R5cKZiZmZmZfWgFXIADUGXeEjIHjsANWMcOzYAzUL+ue9fhDNY0m7TvSrM56PR2sKSYdkRNszVqEbghd0wo4k6ztdMycOMD2KZa2mEV2bLp+4ASYn6OkJwxg0VIjpjBI2TMmGQRMkZM8ghJGTNahKSIGT1ChozJFiFDxGSPkF9iiomQb2KKi5BPYoqNkD4xxUdIV8xkIiT27VDaN04voTczmTfRFouZVIS0YyYZIRWwB3aU+XvJzMzMzP7JE9nJ7S6cU2ClAAAAAElFTkSuQmCC' />
                      <div class="dropdown-content">
                        <ul>
                            <li className="active">Whiteboard 1</li>
                            <li>Whiteboard 2</li>
                            <li>Whiteboard 3</li>
                            <li>Whiteboard 4</li>
                            <li>
                                <button className="btn">Add New Board</button>
                            </li>
                        </ul>
                      </div>
                    </div>
                    <Iframe
                        allowFullScreen = { true }
                        display = 'initial'
                        height = '100%'
                        id = 'myId'
                        position = 'relative'
                        url = { 'https://meet.ourtrial.com/whiteboard/'+APP.conference.roomName+'-MainBoard-'+Math.random()}
                        width = '100%' />
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
