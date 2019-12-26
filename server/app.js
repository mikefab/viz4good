var express = require("express");
var app = express();
var geo = require('./public/sante.json')
let keplerJSON = require('./public/keplergl')
const csv=require('csvtojson')
const fs = require('fs');
const fetch = require('node-fetch');
var jsonfile = require('jsonfile')

app.get("/api/url", (req, res, next) => {
  res.json(keplerJSON)
})

app.get("/api/refresh", (req, res, next) => {
  let seen = {}

  fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSrr9DRaC2fXzPdmOxLW-egSYtxmEp_RKoYGggt-zOKYXSx4RjPsM4EO19H7OJVX1esTtIoFvlKFWcn/pub?gid=1564028913&single=true&output=csv')
  .then(res => res.text())
  .then(body => {
    console.log('Fetch stop')
    let records = (body.split(/\r\n/))

    let cleanCSV = records.reduce((a, r, i) => {
      if (i != 1) {
        a.push(r);
      }
      return a;
    }, []).join('\r\n')

    csv().fromString(cleanCSV.toString()).then((jsonObj) => {
      const zone_names = jsonObj.reduce((h, e) =>
        {
          h[e.health_zone] = e.province;
          return h;
        }, {})
      let keys = Object.keys(zone_names)
      let dict = keys.reduce((h, k) => {
        let target = k.replace('Rwampara (Bunia)', 'Rwampara') + zone_names[k].replace(/\s+/, '-').replace('North', 'Nord').replace('South', 'Sud')

        if (target.match(/MambasaIturi/)) {
          target = 'MambasaIturie'
        }
        if (target.match(/MandimaIturi/)) {
          target = 'MandimaIturie'
        }

        if (target.match(/TchomiaIturi/)) {
          target = 'TchomiaIturie'
        }

        let zone = geo.features.find(f => {
          return f.properties.cle === target
        })

        if (zone) {
          h[k] = zone
          // console.log(zone.properties)
        } else {
          // console.log(k, zone_names[k])
        }
        return h
      }, {})


      let records = jsonObj.reduce((ary, e) => {
        if (dict[e.health_zone] && e.confirmed_cases > 0) {
          let f = dict[e.health_zone]
          e.publication_date = e.publication_date + ' 12:00:00.00'
          e.report_date = e.report_date + ' 12:00:00.00'
          f.properties = {...f.properties, ...e}
          let line = ''
          if (seen[f.properties.cle]) {
            line = f.properties.cle

          } else {
            //console.log(JSON.stringify(f))
            seen[f.properties.cle] = JSON.stringify(f)
            line = seen[f.properties.cle]
          }
            combinedObj = {
              __geojson: line,
              ...e
            }
            ary.push(combinedObj);
        }
          return ary
      }, [])

      console.log('Complete')

      keplerJSON.datasets[0].data.allData = records.map(e => {
        return Object.values(e)
      })
      keplerJSON.info.created_at = Date()
      jsonfile.writeFileSync('./public/keplergl.json', keplerJSON)
      res.json(keplerJSON)
    })

  })
  .catch(err => {
    res.json(keplerJSON)
  })
});

app.listen(5000, () => {
 console.log("Server running on port 5000");
});
