/**
 * Created by xiaokecong on 28/08/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    ToolbarAndroid,
    BackHandler,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modalbox';

import RNFileManager from './RNFileManager';

const Dimensions = require('Dimensions');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class ImagePage extends Component {
    static defaultProps = {
        black: '#000000',
    };

    constructor(props) {
        super(props);
        this.state = {
            type: RNFileManager.TYPE_FILE,
            loaded: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 != row2,
            }),
            dataArr: [],


        };
    }

    componentWillMount() {
        const {black} = this.props;
        Icon.getImageSource('md-more', 250, black).then((source) => this.setState({more: source}));
    }

    componentDidMount() {
        // this.fetchImageFolders();
        this.fetchImageFiles();
        BackHandler.addEventListener('hardwareBackPress', this._back.bind(this));
    }

    _back() {
        if (this.props.navigator) {
            this.props.navigator.pop();
            return true;
        }

        return false;
    }

    fetchImageFolders() {
        RNFileManager.getImageFolders()
            .then((result) => {
                let tmpData = result;
                let tmpDataArr = [];
                let i = 0;
                tmpData.map((item) => {
                    tmpDataArr.push({
                        key: i,
                        value: item,
                    });
                    i ++;
                });
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result),
                    loaded: true,
                    dataArr: tmpDataArr,

                });
                tmpDataArr = null;
                tmpData = null;

            })
            .catch((error) => {
                alert('error:' + error);
            })
            .done();


    }

    fetchImageFiles() {
        RNFileManager.getImageFiles()
            .then((result) => {
                let tmpData = result;
                let tmpDataArr = [];
                let i = 0;
                tmpData.map((item) => {
                    tmpDataArr.push({
                        key: i,
                        value: item,
                    });
                    i ++;
                });
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result),
                    loaded: true,
                    dataArr: tmpDataArr,
                });

                tmpDataArr = null;
                tmpData = null;

            })
            .catch((error) => {
                alert('error:' + error);
            })
            .done();

    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    title={'图片'}
                    actions={[{title:'More',icon:require('./images/icon_more.png'), show:'always'}]}
                    onActionSelected={this.onToolbarActionSelected}
                />

                <Modal
                    style={[styles.modal, styles.popup]}
                    backdrop={true}
                    position={'top'}
                    ref={'popup'}>
                    <Text style={[styles.text, {color: "white"}]}>Modal on top</Text>
                </Modal>

                {/*<ListView*/}
                {/*dataSource={this.state.dataSource}*/}
                {/*renderRow={this.renderListItem.bind(this)}*/}
                {/*contentContainerStyle={styles.listStyle}*/}
                {/*showsVerticalScrollIndicator={false}*/}
                {/*showsHorizontalScrollIndicator={false}*/}
                {/*/>*/}

                <FlatList
                    data={this.state.dataArr}
                    renderItem={this.renderListItem.bind(this)}
                    extraData={this.state}
                />
            </View>
        )
    }


    renderLoadingView() {
        return (
            <View style={styles.loading}>
                <Image
                    source={require('./images/loading.gif')}
                />
            </View>
        );
    }

    onToolbarActionSelected = (position) => {
        if (position == 0) {
            this.changeType();
            // this.refs.popup.open();
        }
    };

    changeType() {
        if (this.state.type == RNFileManager.TYPE_FILE) {
            this.setState({
                type: RNFileManager.TYPE_FOLDER,
            });
            this.fetchImageFolders();
        } else if (this.state.type == RNFileManager.TYPE_FOLDER) {
            this.setState({
                type: RNFileManager.TYPE_FILE,
            });
            this.fetchImageFiles();
        }

    }

    renderListItem(item) {
        if (this.state.type == RNFileManager.TYPE_FILE) {
            return this.renderFileItem(item);
        } else if (this.state.type == RNFileManager.TYPE_FOLDER) {
            return this.renderFolderItem(item);
        }

    }

    renderFileItem(item) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.fileItem}
                onPress={()=>{this.onItemClick(item)}}>
                <View style={styles.fileItem}>
                    <Image style={styles.itemImage} source={{uri:'file://'+item.item.value.imgPath}}/>
                </View>
            </TouchableOpacity>
        );
    }

    renderFolderItem(item) {
        // console.error("type:"+this.state.type+" index:"+item.index+",item:"+item.item.value.firstImgPath);
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.folderItem}
                onPress={()=>{this.onItemClick(item)}}>
                <View style={styles.folderItem}>
                    <Image style={styles.itemImage} source={{uri:'file://'+item.item.value.firstImgPath}}/>
                </View>
            </TouchableOpacity>
        );
    }

    onItemClick = (item) => {
        alert(item);
    }
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    toolbar: {
        backgroundColor: '#e9eaed',
        height: 56,
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    popup: {
        height: 230,
        backgroundColor: "#3B5998"
    },
    listStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    folderItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH / 2,
        height: 200,
        marginTop: 3,
        marginBottom: 3
    },
    fileItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH / 3,
        height: 200,
        marginTop: 3,
        marginBottom: 3
    },
    itemImage: {
        width: 160,
        height: 160
    },
    itemView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10
    },
    itemTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    itemTxt: {
        fontSize: 17,
        marginTop: 5
    }

});