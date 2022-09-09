import { PickerView, PickerViewColumn, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { Component } from 'react';
import areaData from "./areadata.js";
import './index.scss';

export default class RegionPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickVal: [],
            range: {
                provinces: [],
                citys: [],
                areas: []
            },
            checkObj: {},
            values: null
        }
    }

    componentWillMount() {
        this.initData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.state.values) {
            // this.initData();
            this.setState({
                values: prevProps.value,
            }, () => {
                this.initData();
            })
        }
    }

    getData = () => {
        //用来处理初始化数据
        let provinces = areaData;
        let dVal = [];
        let value = this.props.value;
        let a1 = value[0];//默认值省
        let a2 = value[1];//默认值市
        let a3 = value[2];//默认值区、县
        let province, city, area;
        let provinceIndex = provinces.findIndex((v) => {
            return v[this.props.defaultType] == a1
        });
        provinceIndex = value ? (provinceIndex != -1 ? provinceIndex : 0) : 0;
        let citys = provinces[provinceIndex].children;
        let cityIndex = citys.findIndex((v) => {
            return v[this.props.defaultType] == a2
        });
        cityIndex = value ? (cityIndex != -1 ? cityIndex : 0) : 0;
        let areas = citys[cityIndex].children;
        let areaIndex = areas.findIndex((v) => {
            return v[this.props.defaultType] == a3;
        });
        areaIndex = value ? (areaIndex != -1 ? areaIndex : 0) : 0;
        dVal = this.props.hideArea ? [provinceIndex, cityIndex] : [provinceIndex, cityIndex, areaIndex];
        province = provinces[provinceIndex];
        city = citys[cityIndex];
        area = areas[areaIndex];
        let obj = this.props.hideArea ? {
            province,
            city
        } : {
                province,
                city,
                area
            }
        return this.props.hideArea ? {
            provinces,
            citys,
            dVal,
            obj
        } : {
                provinces,
                citys,
                areas,
                dVal,
                obj
            }
    }

    initData = () => {
        let dataData = this.getData();
        let provinces = dataData.provinces;
        let citys = dataData.citys;
        let areas = this.props.hideArea ? [] : dataData.areas;
        let obj = dataData.obj;
        let province = obj.province, city = obj.city, area = this.props.hideArea ? {} : obj.area;
        let value = this.props.hideArea ? [province.value, city.value] : [province.value, city.value, area.value];
        let result = this.props.hideArea ? `${province.label + city.label}` : `${province.label + city.label + area.label}`;
        this.setState({
            range: (this.props.hideArea ? {
                provinces,
                citys,
            } : {
                    provinces,
                    citys,
                    areas
                })
        })
        this.setState({
            checkObj: obj
        })
        Taro.nextTick(() => {
            this.setState({
                pickVal: dataData.dVal
            })
        });
        this.props.change({
            result: result,
            value: value,
            obj: obj
        })
    }

    handlerChange = (e) => {
        let range = { ...this.state.range }
        console.log(range)
        let arr = [...e.detail.value];
        console.log('arr',arr)
        let provinceIndex = arr[0], cityIndex = arr[1], areaIndex = this.props.hideArea ? 0 : arr[2];
        let provinces = areaData;
        let citys = (provinces[provinceIndex] && provinces[provinceIndex].children) || provinces[provinces.length - 1].children || [];
        let areas = this.props.hideArea ? [] : ((citys[cityIndex] && citys[cityIndex].children) || citys[citys.length - 1].children || []);
        let province = provinces[provinceIndex] || provinces[provinces.length - 1],
            city = citys[cityIndex] || [citys.length - 1],
            area = this.props.hideArea ? {} : (areas[areaIndex] || [areas.length - 1]);
        let obj = this.props.hideArea ? {
            province,
            city
        } : {
                province,
                city,
                area
            }
        if (this.state.checkObj.province.label != province.label) {
            //当省更新的时候需要刷新市、区县的数据;
            arr = [arr[0], 0, 0]
            range.citys = citys;
            if (!this.props.hideArea) {
                range.areas = areas;
            }
            this.setState({
                range,
            })

        }
        if (this.state.checkObj.city.label != city.label) {
            //当市更新的时候需要刷新区县的数据;
                arr = [arr[0], arr[1], 0]
            if (!this.props.hideArea) {
                range.areas = areas;
            }
            this.setState({
                range
            })
        }
        if(!obj.city) {
            obj.city = citys[0]
            obj.area = areas[0]
        }
        if(!obj.area) {
            obj.area = areas[0]
        }
        this.setState({
            checkObj: obj,
            pickVal: arr
        })
        Taro.nextTick(() => {
            this.setState({
                pickVal: arr
            })
        });
        let result = this.props.hideArea ? `${province.label + city.label}` : `${province.label + city.label + area.label}`;
        let value = this.props.hideArea ? [province.value, city.value] : [province.value, city.value, area.value];
        this.props.change({
            result: result,
            value: value,
            obj: obj
        })

    }

    render() {
        const { pickVal,range }=this.state
        return (
            <View className='w-picker-view'>
                <PickerView className="d-picker-view" value={pickVal} onChange={this.handlerChange}>
                    <PickerViewColumn>
                        {
                            range.provinces.map((item) => <View key={item.value}>{item.label}</View>)
                        }
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {
                            range.citys.map((item) => <View key={item.value}>{item.label}</View>)
                        }
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {
                            range.areas.map((item) => <View key={item.value}>{item.label}</View>)
                        }
                    </PickerViewColumn>
                </PickerView>
            </View>

        )
    }
}

RegionPicker.propTypes = {
    itemHeight: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array
    ]),
    defaultType: PropTypes.string,
    hideArea: PropTypes.bool
}
RegionPicker.defaultProps = {
    itemHeight: "44px",
    value: "",
    defaultType: "label",
    hideArea: false
};