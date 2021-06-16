import "../scss/styles.scss";

import "./videoPlayer";
import "./videoRecorder";
import "./aboutVideoComment";
import "./aboutPhotoComment";
import "./deviceList";
import "./remote";
import "./productPage";
import "./chart";
import "./imgslides";

// import pymongo
// import pandas as pd
// import json
// import copy
// import sys
// import numpy as np
// from datetime import datetime, timedelta
// from bson.objectid import ObjectId
// from bson.json_util import dumps
// from bson import json_util
// from dateutil.relativedelta import relativedelta

// connection = pymongo.MongoClient("127.0.0.1", 27017)

// db = connection.DOGBAB

// foods = db.foods

// product_id = sys.argv[1]
// bson_id = ObjectId(product_id)

// start_date = sys.argv[2]
// end_date = sys.argv[3]

// dateFormatter = "%Y-%m-%d"
// convert_date = datetime.strptime(start_date, dateFormatter)
// convert_endDate = datetime.strptime(end_date, dateFormatter)
// period = convert_endDate - convert_date
// int_period = int(period.days)

// # print(int_period)
// df_foods = list(
//     foods.find({'product': bson_id, 'time': {'$gte': convert_date,
//                '$lt': convert_endDate}}).sort("time", pymongo.DESCENDING)
// )

// dic_by_date = {}

// if len(df_foods) != 0:
//     pd_df_foods = pd.DataFrame(df_foods)
//     pd_df_foods.drop('_id', axis=1, inplace=True)
//     pd_df_foods.drop('product', axis=1, inplace=True)
//     pd_df_foods.drop('controller', axis=1, inplace=True)
//     pd_df_foods.drop('__v', axis=1, inplace=True)

//     # DataFrame 그루핑 및 연산
//     if int_period <= 9:
//         foods_mean_days = pd_df_foods.groupby(
//             pd_df_foods.set_index('time').index.date).mean().fillna(0)

//         foods_date_array = pd.date_range(start=convert_date,
//                                          end=convert_endDate).tolist()
//         foods_dates_array = []

//         for food_date in foods_date_array:
//             if food_date.date() not in foods_mean_days.index:
//                 foods_dates_array.append(food_date)

//         for date in foods_dates_array:
//             foods_mean_days.loc[date.date()] = 0

//         sort_foods_mean_days = foods_mean_days.sort_index()

//         dic_by_date = {
//             'amount': sort_foods_mean_days['amount'].tolist(),
//             'rest': sort_foods_mean_days['rest'].tolist(),
//             'weight': sort_foods_mean_days['weg'].tolist()
//         }

//         date_container = []

//         for sort_date in sort_foods_mean_days.index.tolist():
//             string_date = sort_date.strftime('%Y-%m-%d')
//             date_container.append(string_date)

//         print(dumps(date_container))  # 날짜 목록

//     elif 9 < int_period <= 20:
//         foods_mean_days = pd_df_foods.resample('2D', on='time')[
//             'amount', 'rest', 'weg'].mean().dropna(axis=0)

//         sort_foods_mean_days = foods_mean_days.sort_index()

//         dic_by_date = {
//             'amount': sort_foods_mean_days['amount'].round(1).tolist(),
//             'rest': sort_foods_mean_days['rest'].round(1).tolist(),
//             'weight': sort_foods_mean_days['weg'].round(1).tolist()
//         }

//         foods_date_container = []

//         for sort_date in sort_foods_mean_days.index.tolist():
//             string_date = sort_date.strftime('%Y-%m-%d')
//             foods_date_container.append(string_date)

//         print(dumps(foods_date_container))  # 날짜 목록

//     elif 20 < int_period <= 30:
//         foods_mean_days = pd_df_foods.resample('3D', on='time')[
//             'amount', 'rest'].mean().dropna(axis=0)

//         sort_foods_mean_days = foods_mean_days.sort_index()

//         dic_by_date = {
//             'amount': sort_foods_mean_days['amount'].round(1).tolist(),
//             'rest': sort_foods_mean_days['rest'].round(1).tolist(),
//             'weight': sort_foods_mean_days['weg'].round(1).tolist()
//         }

//         foods_date_container = []

//         for sort_date in sort_foods_mean_days.index.tolist():
//             string_date = sort_date.strftime('%Y-%m-%d')
//             foods_date_container.append(string_date)

//         print(dumps(foods_date_container))  # 날짜 목록

//     elif 30 < int_period <= 90:
//         foods_mean_days = pd_df_foods.resample('W-Mon', on='time')[
//             'amount', 'rest'].mean().dropna(axis=0)

//         sort_foods_mean_days = foods_mean_days.sort_index()

//         dic_by_date = {
//             'amount': sort_foods_mean_days['amount'].round(1).tolist(),
//             'rest': sort_foods_mean_days['rest'].round(1).tolist(),
//             'weight': sort_foods_mean_days['weg'].round(1).tolist()
//         }

//         foods_date_container = []

//         for sort_date in sort_foods_mean_days.index.tolist():
//             string_date = sort_date.strftime('%Y-%m-%d')
//             foods_date_container.append(string_date)

//         print(dumps(foods_date_container))  # 날짜 목록

//     elif 91 < int_period <= 180:
//         foods_mean_days = pd_df_foods.resample('2W-Mon', on='time')[
//             'amount', 'rest'].mean().dropna(axis=0)

//         sort_foods_mean_days = foods_mean_days.sort_index()

//         dic_by_date = {
//             'amount': sort_foods_mean_days['amount'].round(1).tolist(),
//             'rest': sort_foods_mean_days['rest'].round(1).tolist(),
//             'weight': sort_foods_mean_days['weg'].round(1).tolist()
//         }

//         foods_date_container = []

//         for sort_date in sort_foods_mean_days.index.tolist():
//             string_date = sort_date.strftime('%Y-%m-%d')
//             foods_date_container.append(string_date)

//         print(dumps(foods_date_container))  # 날짜 목록

//     elif 180 < int_period <= 365:
//         foods_mean_days = pd_df_foods.resample('M', on='time')[
//             'amount', 'rest'].mean().dropna(axis=0)

//         sort_foods_mean_days = foods_mean_days.sort_index()

//         dic_by_date = {
//             'amount': sort_foods_mean_days['amount'].round(1).tolist(),
//             'rest': sort_foods_mean_days['rest'].round(1).tolist(),
//             'weight': sort_foods_mean_days['weg'].round(1).tolist()
//         }

//         foods_date_container = []

//         for sort_date in sort_foods_mean_days.index.tolist():
//             string_date = sort_date.strftime('%Y-%m-%d')
//             foods_date_container.append(string_date)

//         print(dumps(foods_date_container))  # 날짜 목록

//     elif 365 < int_period <= 730:
//         foods_mean_days = pd_df_foods.resample('2M', on='time')[
//             'amount', 'rest'].mean().dropna(axis=0)

//         sort_foods_mean_days = foods_mean_days.sort_index()

//         dic_by_date = {
//             'amount': sort_foods_mean_days['amount'].round(1).tolist(),
//             'rest': sort_foods_mean_days['rest'].round(1).tolist(),
//             'weight': sort_foods_mean_days['weg'].round(1).tolist()
//         }

//         foods_date_container = []

//         for sort_date in sort_foods_mean_days.index.tolist():
//             string_date = sort_date.strftime('%Y-%m-%d')
//             foods_date_container.append(string_date)

//         print(dumps(foods_date_container))  # 날짜 목록

//     elif 730 < int_period:
//         foods_mean_days = pd_df_foods.resample('Y', on='time')[
//             'amount', 'rest'].mean().dropna(axis=0)

//         sort_foods_mean_days = foods_mean_days.sort_index()

//         dic_by_date = {
//             'amount': sort_foods_mean_days['amount'].round(1).tolist(),
//             'rest': sort_foods_mean_days['rest'].round(1).tolist(),
//             'weight': sort_foods_mean_days['weg'].round(1).tolist()
//         }

//         foods_date_container = []

//         for sort_date in sort_foods_mean_days.index.tolist():
//             string_date = sort_date.strftime('%Y-%m-%d')
//             foods_date_container.append(string_date)

//         print(dumps(foods_date_container))  # 날짜 목록

//     json_by_date = dumps(dic_by_date)
//     print(json_by_date)  # 종류별 평균
//     print(dumps(df_foods))

// else:
//     print(dumps([]))  # 데이터 없을 시
//     print(dumps({}))
//     print(dumps([]))
