import React, {Component} from 'react';
import styles from './MessageBubble.module.css';

class MessageBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaDownloadFailed: false,
      mediaUrl: null,
    };
  }

  componentDidMount = () => {
    if (this.props.message.type === 'media') {
      this.props.message.media
        .getContentUrl()
        .then(url => {
          this.setState({mediaUrl: url});
        })
        .catch(e => this.setState({mediaDownloadFailed: true}));
    }
  };

  render = () => {
    const {itemStyle, divStyle} =
      this.props.direction === 'incoming'
        ? {
            itemStyle: styles.received_msg,
            divStyle: styles.received_withd_msg,
          }
        : {itemStyle: styles.outgoing_msg, divStyle: styles.sent_msg};

    const m = this.props.message;
    if (m.type === 'media') {
      console.log('Message is media message');
      // log media properties
      console.log('Media properties', m.media);
    }

    return (
      <li className={itemStyle}>
        <div className={divStyle}>
          <div>
            <strong>{m.author}</strong>
            <br />
            {m.type === 'media' ? (
              <Media
                hasFailed={this.state.mediaDownloadFailed}
                url={this.state.mediaUrl}
              />
            ) : null}
            {m.body}
          </div>
          <span className={styles.time_date}>
            {m.timestamp.toLocaleString()}
          </span>
        </div>
      </li>
    );
  };
}

function Media(props) {
  if (props.hasFailed) return <p>(Failed to download media!)</p>;
  else if (props.url === null) return <p>Downloading…</p>;
  // eslint-disable-next-line
  else return <img className={styles.image} src={props.url} />;
}

export default MessageBubble;
