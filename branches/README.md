# BRANCH API DOCUMENTATION

`Bbranches` cedvelinin `socket`i beledi

```javascript
var service = new WebSocket("ws://127.0.0.1:8000/branches/");
```

`Socket`e qoshulduqdan sonra bele bir action gondermelisen.

```JSON
service.send(JSON.stringify({
    action: 'get_branches',
    payload: {
      limit : 10,
      offset: 0,
      search: ""
    }
}));
```

Burada `limit`, `offset` ve searchi istediyin kimi qoya bilersen baslangicda.

Bu `actiona` bele bir cavab gelecek.

```JSON
{"action": "get_branches",
"payload": {
			"branches":[
						{
						"id": 1,
						"name": "branch2",
						"departments": [
										{"id": 6, "name": "Kassa"},
										{"id": 4, "name": "Huquqi shexsler"}
										]
						},
						{
						"id": 2,
						"name": "branch2",
						"departments": [
										{"id": 6, "name": "Kassa"},
										{"id": 4, "name": "Huquqi shexsler"}
										]
						},
						{
						"id": 3,
						"name": "branch2",
						"departments": [
										{"id": 6, "name": "Kassa"},
										{"id": 4, "name": "Huquqi shexsler"}
										]
						},
						{
						"id": 4,
						"name": "branch2",
						"departments": [
										{"id": 6, "name": "Kassa"},
										{"id": 4, "name": "Huquqi shexsler"}
										]
						},
						]
			"count": 4
		}
}
```

Burada `count` `branch`lerin umumi sayidi.

Bu `data`ni ozunde lazimi yere yerlesdirdikden sonra mene bele bir `action` gonderirsen.

```javascript
{
  action: "start";
}
```

ve bundan sonra dinamik datalar gelmeye basliyir.

Eger `user page` deyishse ve ya nese `search` elese yene de `{"action":"get_branches"}` teze `limit` ,`offset` ve `search`nan gondermelisen ve cavab geldikden sonre eyni emeliyyatlari elemelisen.

Amma nezere al ki, `{"action": "get_branches"}` gunun axirida databasede temizlenme gedende de gelecek, ona gore `{"action": "get_branches"}` ile `data` gelende ozundeki `data`ni yenile ve sonda hemise `{action: 'start'}` gonder.

Kodu ele qur ki istenilen `action` nevaxt gelse lazimli emeliyyatlari elesin.`{action: 'start'}` gonderdikden sonra sene iki cur `action` gelecek

1. `{"action": "update_branch"}` branche aid `datan`i yenileyir, gelen obyekt bele olacaq.

```JSON
{"action": "update_branch",
"payload": {
			"id": 2,
			"ticket_count": 1,
			"served_customer_count": 0,
			"waiting_customer_count": 1,
			"free_user_count": 0,
			"fte": 0,
			"online_user_count": 1,
			"open_counter_count": 1,
			"closed_counter_count": 1,
			"vacation_count": 0,
			"displacement_from_count": 0,
			"displacement_to_count": 0,
			"max_free_time": {
								"text": "0:00:00",
								"value": 0,
								"calculation_time":
								"2020-01-23 13:36:57.739734+00:00",
								"dinamic": false,
								"coefficient": 1
							}


		}
}
```

Burada `id` `branch`-in idsini gosterir. `{"action": "update_branch"}`in `payload`inda bezi qiymetler gelmiye biler onu nezere al, ve kodu ele yaz ki `{"action": "update_branch"}`de ne gelse uygun datalari yenilesin.

2. `{"action": "update_department"}` departmente aid datani yenileyir, gelen obyekt bele olacaq.

```JSON
{"action": "update_department",
"payload": {
			"id": 1,
			"ticket_count": 0,
			"served_customer_count": 0,
			"waiting_customer_count": 1,
			"fte": 0,
			"online_user_count": 2,
			"vacation_count": 0,
			"displacement_from_count": 0,
			"displacement_to_count": 0
		}
}
```

Burada `id` `department`in `id`sini gosterir. `{"action": "update_department"}` in `payload`inda bezi qiymetler gelmiye de biler onu nezere al, ve kodu ele yaz ki `{"action": "update_department"}`de ne gelse uygun datalari yenilesin. Senin koduvun umumi strukturu bele birsey olmalidi

```javasciprt
  service.onopen = function() {
       service.send(JSON.stringify({
            action: 'get_branches',
            payload: {
              limit : 10,
              offset: 0,
              search: ""
            }
        }));
  }

  service.onmessage = function(event) {

    if(event.data.action == 'get_branches'){

        //datani yerbeyer eledin

        service.send(JSON.stringify({
            action: 'start'
        }));

    }

    if(event.data.action == 'update_branch'){

       //datani yerbeyer eledin
    }

    if(event.data.action == 'update_department'){

       //datani yerbeyer eledin
    }

  }
```

`user page` deyisdikde ve ya `search`a nese yazdiqda bunu gonderirsen

```javascript
onevent = function() {
  service.send(
    JSON.stringify({
      action: "get_branches",
      payload: {
        limit: 10,
        offset: 0,
        search: ""
      }
    })
  );
};
```
