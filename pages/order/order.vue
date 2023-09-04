<template>
	<view class="content u-p-20" style="background-color: #fff;">
		<view class="u-flex u-p-20 u-row-between ">
			<view>需要原片</view>
			<switch :checked="form.origin" @change="originChange"/>
		</view>
		<text v-if="form.origin" class="u-tips-color">
			提供原片费用50元
		</text>
		<view class="u-flex u-p-20 u-row-between ">
			<view>自带服装</view>
			<switch :checked="form.cloth" @change="closeChange" />
		</view>
		<text v-if="form.cloth" class="u-tips-color">
			自带服装收取50元服务费
		</text>
		<view v-if="!form.cloth" class="u-border u-m-15" style="border-radius: 15px;">
			<view>
				<view class="u-p-15 u-tips-color">选择服装</view>
				<view class="guess-section">
					<view 
						v-for="(item, index) in clothList" :key="index"
						class="guess-item"
						
					>
						<view class="image-wrapper" @click="toInfo(item)">
							<image :src="picUrl+item.pic1" mode="aspectFill"></image>
						</view>
						<text class="title clamp">{{item.name}}</text>
						<text class="price">￥{{item.price}}</text>
						<view>
							<u-checkbox-group>
								<u-checkbox v-model="item.sel" @change="setItem(item)">选择</u-checkbox>
							</u-checkbox-group>
							
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="u-flex u-p-20 u-row-between ">
			<view>外景拍摄</view>
			<switch :checked="form.place" @change="placeChange"/>
		</view>
		<text v-if="form.place" class="u-tips-color">
			外景拍摄基础费用500元
		</text>
		<view  v-if="!form.place" class="u-border u-m-15" style="border-radius: 15px;">
			<view class="u-p-15 u-tips-color">选择场地</view>
			<view class="guess-section">
				<view 
					v-for="(item, index) in placeList" :key="index"
					class="guess-item"
					
				>
					<view class="image-wrapper" @click="toInfo(item)">
						<image :src="picUrl+item.pic1" mode="aspectFill"></image>
					</view>
					<text class="title clamp">{{item.name}}</text>
					<text class="price">￥{{item.price}}</text>
					<view>
						<u-checkbox-group>
							<u-checkbox v-model="item.sel" @change="setItem(item)">选择</u-checkbox>
						</u-checkbox-group>
						
					</view>
				</view>
			</view>
		
		
		
		</view>
		<view class=" u-p-20  " style="background-color: white;">
			<u-form :model="form" ref="uForm">
			<u-form-item label="预约日期" label-width="140" prop="name">
				<u-input placeholder="选择预约日期" :disabled="true" @click="showDate=true;" v-model="form.orderTime" />
			</u-form-item>
			<u-form-item label="备注" prop="memo" labelPosition="top" >
				<u-input placeholder="请输入备注" type="textarea" v-model="form.memo" />
			</u-form-item>
			<u-form-item label="总价" label-width="140" prop="name" :border-bottom="false">
				<u-input placeholder="计算总价" style="color: darkorange;" :disabled="true" v-model="form.price" />
			</u-form-item>
			<text class="u-tips-color">
				基础费用100元
			</text>
			</u-form>
			
			<u-button @click="submit" class="u-m-t-30" type="primary">提交预约</u-button>
			
		</view>
		
		<u-calendar z-index="99999999" max-date="2050-01-01" v-model="showDate" mode="date" @change="getDate" />
	
		
	</view>
</template> 

<script>
	import appRequest from "@/common/appRequestUrl.js";
	export default {
		data() {
			return {
				showDate:false,
				form:{
					place:false,
					cloth:false,
					orderTime:"",
					price:100,
					origin:false,
					clothList:[],
					placeList:[]
				},
				show:false,
				picUrl:appRequest.urlMap.getPicById,
				tabCurrentIndex: 0,
				selOrder:"",
				selItem:[],
				user:{},
				clothList:[],
				placeList:[]
			};
		},
		
		onLoad(options){
			this.getData(0);
			this.getData(1);
			
		},onShow() {
			let _this = this;
			let userInfo = appRequest.getUserInfo();
			if(!userInfo){
				this.toLogin();
			}
		},
		 
		methods: {
			toLogin(){
				let _this = this;
				let userInfo = appRequest.getUserInfo();
				if(!userInfo){
					wx.login({
						success(res) {
							if (res.code) {
								let code = res.code;
								uni.showModal({
									title: "登录",
									content: "请授权获取微信信息用于登录",
									success: function(res) {
										if (res.confirm) {
											_this.getUserLogin(code);
										}
									}
								})
				
							} else {
								console.log('登录失败！' + res.errMsg)
							}
						}
					})
				
				}else{
					this.userInfo = userInfo;
				}
			},getUserLogin(code){
				let _this = this;
				uni.clearStorage();
				wx.getUserProfile({
					desc: '使用前需要微信授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						console.log(JSON.stringify(res));
						appRequest.request({
							method: "GET",
							data: {
								code: code,
								enData: res.encryptedData,
								iv:res.iv,
								userInfo:res.userInfo
							},
							url: appRequest.urlMap.loginCheck,
							success: function(res) {
								if(res.data.code == 200){
									try {
										uni.setStorageSync('userInfo', res.data.data);
										uni.switchTab({
											url:"/pages/index/index"
										})
									} catch (e) {
										//callback()
										uni.clearStorage();
									}	
								}else{
									//callback()
								}
							},
							fail: function(res) {
								//callback();
							}
						})
					},fail: (err) => {
						console.log(err);
					}
				})
			},
			submit(){
				let _this = this;
				if(this.form.clothList.length == 0 && !this.form.cloth ){
					_this.$api.msg("至少需选择一件服装或选择自带。");
					return;
				}
				if(this.form.placeList.length == 0 && !this.form.place ){
					_this.$api.msg("至少需选择一个场景或选择外景。");
					return;
				}
				if(!this.form.orderTime || !this.form.memo){
					_this.$api.msg("时间和备注均需填写");
					return;
				}
				this.form.origin = this.form.origin ? 1:0;
				this.form.cloth = this.form.cloth ? 1:0;
				this.form.place = this.form.place ? 1:0;
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.addPhOrder,
					data:this.form,
					success: function(res) {
						if(res.data.code == 200){
							 _this.$api.msg(res.data.msg);
							 uni.redirectTo({
							 	url:"/pages/index/index"
							 })
						}else{
							_this.$api.msg(res.data.msg);
						}
				
					},
					fail: function(res) {
						_this.$api.msg("请求异常");
					}
				})
			},
			getPrice(){
				let price = 100;
				let _this = this;
				if(this.form.origin){
					price+=50;
				}
				
				if(this.form.cloth){
					price+=50;
					_this.form.clothList=[];
				}else{
					this.clothList.map(function(item,arr){
						
						if(item.sel){
							price += item.price;
							_this.form.clothList.push(item);
						}
						
					});
				}
				
				if(this.form.place){
					price+=500;
					_this.form.placeList=[];
				}else{
					this.placeList.map(function(item,arr){
						if(item.sel){
							price += item.price;
							_this.form.placeList.push(item);
						}
					});
				}
				this.form.price = price;
				this.$forceUpdate();
				return price;
				
			},
			getDate(e){
				
				this.form.orderTime = e.result;
			},
			setItem(item){
				
				item['sel'] = !item['sel'];
				
				this.getPrice();
			},
			toInfo(item){
				uni.navigateTo({
					url:"../product/product?id="+item.id+"&type=1"
				})
			},
			splitTag(text){
				return text.split(" ");
			},originChange(e){
				this.form.origin = e.detail.value;
				this.getPrice();
			},
			closeChange(e){
				this.form.cloth = e.detail.value;
				this.getPrice();
			},placeChange(e){
				this.form.place = e.detail.value;
				this.getPrice();
			},getData(tab){
				let _this = this;
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.findPhClothPlaceList,
					data:{
						type:tab,
						validFlag:1
					},
					success: function(res) {
						
						if(res.data.code == 200){
							
							res.data.data.map(function(item,index){
								item['sel'] = false;
							});
							
							if(tab==0){
								_this.clothList = res.data.data;
							}else{
								_this.placeList = res.data.data;
							}  
						}else{
							_this.$api.msg(res.data.msg);
						}
				
					},
					fail: function(res) {
						_this.$api.msg("请求异常");
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.guess-section{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.guess-item{
			display:flex;
			flex-direction: column;
			width: 30%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 85%;
			height: 180upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-sm;
			color: $font-color-dark;
			line-height: 60upx;
		}
		.price{
			font-size: $font-sm;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
</style>
