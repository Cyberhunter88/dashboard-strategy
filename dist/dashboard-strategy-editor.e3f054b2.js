"use strict";(Array.isArray(self.webpackChunkdashboard_strategy)?self.webpackChunkdashboard_strategy:self.webpackChunkdashboard_strategy=[]).push([[8],{8475(e,t,a){let i,o;function r(){return o??(o=a.e(602).then(()=>a(382)).then(e=>(i=e.default??e,i)).catch(e=>{throw o=void 0,e})),o}function s(){if(!i)throw new Error("js-yaml is not loaded yet; wrap the YAML action in withYaml()");return i}function n(e){i?e():r().then(e,()=>{})}function d(e){return(e instanceof Error?e.message.split("\n")[0]:"Ungültiges YAML")||"Ungültiges YAML"}function c(e,t){if(!e.trim())return{parsed_config:void 0};try{const a=s().load(e);return a&&"object"==typeof a?{parsed_config:a}:{parsed_config:void 0,_yaml_error:t}}catch(e){return{parsed_config:void 0,_yaml_error:d(e)}}}function l(e,t,a){const i=c(t,a);return{...e,yaml:t,parsed_config:i.parsed_config,_yaml_error:i._yaml_error}}a.r(t),a.d(t,{Simon42DashboardStrategyEditor:()=>Me});var _=a(1113);const h=e=>0===Object.keys(e).length;function u(e,t,a){const i=[...e??[]];return a?i.includes(t)?i:[...i,t]:i.filter(e=>e!==t)}function p(e,t,a){const i={...e};return a.length>0?i[t]=a:delete i[t],i}function m(e,t,a){const i=a({...e.areas_options?.[t]??{}}),o={...e.areas_options,[t]:i};h(i)&&delete o[t];const r={...e,areas_options:o};return h(o)&&delete r.areas_options,r}function g(e,t,a,i){return m(e,t,e=>{const t=i({...e.groups_options?.[a]??{}}),o={...e.groups_options,[a]:t};h(t)&&delete o[a];const r={...e,groups_options:o};return h(o)&&delete r.groups_options,r})}function v(e,t,a,i){return g(e,t,a,e=>p(e,"hidden",i))}function y(e,t){const a=t({...e.areas_display}),i={...e,areas_display:a};return h(a)&&delete i.areas_display,i}function b(e,t){return t.areas_options?.[e]?.groups_options?.badges?.additional||[]}function w(e,t){const a=new Set;for(const i of e){const e=t.states[i];e&&(0,_.g7)(e.attributes?.device_class)&&a.add(i)}return a}function f(e,t){const a=t.areas_options?.[e]?.groups_options?.badges;return{namesVisible:a?.names_visible||[],namesHidden:a?.names_hidden||[]}}function k(e,t,a){const i={};for(const[o,r]of Object.entries(t.areas_options?.[e]?.groups_options??{})){const e=r[a];e&&(i[o]=e)}return i}function x(e,t){return k(e,t,"hidden")}function C(e,t){return k(e,t,"order")}var $=a(6684);const S=[{type:"tile",name:"Kachel",icon:"mdi:square-rounded",template:'type: tile\nentity: ""\n'},{type:"entities",name:"Entitätsliste",icon:"mdi:format-list-bulleted",template:'type: entities\nentities:\n  - entity: ""\n'},{type:"glance",name:"Glance",icon:"mdi:eye",template:'type: glance\nentities:\n  - entity: ""\n'},{type:"button",name:"Button",icon:"mdi:gesture-tap-button",template:'type: button\nentity: ""\ntap_action:\n  action: toggle\n'},{type:"markdown",name:"Text / Markdown",icon:"mdi:language-markdown",template:'type: markdown\ncontent: "**Text**"\n'},{type:"heading",name:"Überschrift",icon:"mdi:format-header-1",template:'type: heading\nheading: "Überschrift"\nheading_style: title\nicon: mdi:home\n'},{type:"weather-forecast",name:"Wettervorhersage",icon:"mdi:weather-partly-cloudy",template:'type: weather-forecast\nentity: ""\nshow_current: true\nshow_forecast: true\nforecast_type: daily\n'},{type:"gauge",name:"Messanzeige",icon:"mdi:gauge",template:'type: gauge\nentity: ""\nmin: 0\nmax: 100\n'},{type:"thermostat",name:"Thermostat",icon:"mdi:thermostat",template:'type: thermostat\nentity: ""\n'},{type:"media-control",name:"Mediensteuerung",icon:"mdi:play-circle",template:'type: media-control\nentity: ""\n'},{type:"history-graph",name:"Verlaufsgraph",icon:"mdi:chart-line",template:'type: history-graph\nentities:\n  - entity: ""\nhours_to_show: 24\n'},{type:"statistics-graph",name:"Statistikgraph",icon:"mdi:chart-bar",template:'type: statistics-graph\nentities:\n  - entity: ""\nstat_types:\n  - mean\nchart_type: line\nperiod: 5minute\n'},{type:"picture",name:"Bild",icon:"mdi:image",template:'type: picture\nimage: ""\n'},{type:"picture-entity",name:"Entity-Bild",icon:"mdi:image-outline",template:'type: picture-entity\nentity: ""\n'},{type:"map",name:"Karte",icon:"mdi:map",template:'type: map\nentities:\n  - entity: ""\n'},{type:"todo-list",name:"Aufgabenliste",icon:"mdi:checkbox-marked-circle",template:'type: todo-list\nentity: ""\n'},{type:"logbook",name:"Logbuch",icon:"mdi:history",template:'type: logbook\nentity: ""\nhours_to_show: 24\n'},{type:"alarm-panel",name:"Alarmanlage",icon:"mdi:shield-home",template:'type: alarm-panel\nentity: ""\n'},{type:"energy-distribution",name:"Energieverteilung",icon:"mdi:lightning-bolt",template:"type: energy-distribution\n"},{type:"grid",name:"Raster",icon:"mdi:grid",template:"type: grid\ncards: []\n"}];var A=a(3401),O=a(3294);var P=a(8627),W=a(9526);const q={hide_unavailable_entities:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_unavailable_entities",values:[!0,!1]},dense_section_placement:{kind:"boolean",defaultValue:!1,labelKey:"editor.dense_section_placement",values:[!0,!1]},show_light_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_light_summary",values:[!0,!1]},show_covers_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_covers_summary",values:[!0,!1]},show_security_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_security_summary",values:[!0,!1]},show_climate_summary:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_climate_summary",values:[!0,!1]},show_battery_summary:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_battery_summary",values:[!0,!1]},show_person_badges:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_person_badges",values:[!0,!1]},show_unavailable_alert_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_unavailable_alert_badge",values:[!0,!1]},show_now_playing_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_now_playing_badge",values:[!0,!1]},show_sun_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_sun_badge",values:[!0,!1]},show_updates_badge:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_updates_badge",values:[!0,!1]},show_clock_card:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_clock_card",values:[!0,!1]},show_search_card:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_search_card",values:[!0,!1]},show_security_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_security_view",values:[!0,!1]},group_security_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_security_by_areas",values:[!0,!1]},hide_hidden_areas_in_security:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_hidden_areas_in_security",values:[!0,!1]},show_security_activity:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_security_activity",values:[!0,!1]},show_light_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_light_view",values:[!0,!1]},group_lights_by_floors:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_lights_by_floors",values:[!0,!1]},group_lights_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_lights_by_areas",values:[!0,!1]},show_covers_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_covers_view",values:[!0,!1]},group_covers_by_floors:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_covers_by_floors",values:[!0,!1]},group_covers_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_covers_by_areas",values:[!0,!1]},show_climate_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_climate_view",values:[!0,!1]},nested_light_groups:{kind:"boolean",defaultValue:!1,labelKey:"editor.nested_light_groups",values:[!0,!1]},show_partially_open_covers:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_partially_open_covers",values:[!0,!1]},hide_mobile_app_batteries:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_mobile_app_batteries",values:[!0,!1]},hide_battery_notes_entities:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_battery_notes_entities",values:[!0,!1]},show_battery_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_battery_view",values:[!0,!1]},show_area_in_battery_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_area_in_battery_view",values:[!0,!1]},group_batteries_by_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_batteries_by_areas",values:[!0,!1]},favorites_show_state:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_state",values:[!0,!1]},favorites_hide_last_changed:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_last_changed",values:[!0,!1]},group_by_floors:{kind:"boolean",defaultValue:!1,labelKey:"editor.group_by_floors",values:[!0,!1]},show_switches_on_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_switches_on_areas",values:[!0,!1]},show_alerts_on_areas:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_alerts_on_areas",values:[!0,!1]},show_locks_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_locks_in_rooms",values:[!0,!1]},show_automations_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_automations_in_rooms",values:[!0,!1]},show_scripts_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_scripts_in_rooms",values:[!0,!1]},show_vacuums_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_vacuums_section_in_rooms",values:[!0,!1]},show_switches_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_switches_section_in_rooms",values:[!0,!1]},show_helpers_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_helpers_section_in_rooms",values:[!0,!1]},show_sensors_section_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_sensors_section_in_rooms",values:[!0,!1]},show_cover_controls_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_cover_controls_in_rooms",values:[!0,!1]},show_cameras_in_rooms:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_cameras_in_rooms",values:[!0,!1]},camera_live_toggle:{kind:"boolean",defaultValue:!1,labelKey:"editor.camera_live_toggle",values:[!0,!1]},show_energy_in_rooms:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_energy_in_rooms",values:[!0,!1]},show_ups_in_rooms:{kind:"boolean",defaultValue:!0,labelKey:"editor.show_ups_in_rooms",values:[!0,!1]},hide_grouped_climate_members:{kind:"boolean",defaultValue:!0,labelKey:"editor.hide_grouped_climate_members",values:[!0,!1]},show_windows_summary:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_windows_summary",values:[!0,!1]},compact_overview_summaries:{kind:"boolean",defaultValue:!1,labelKey:"editor.compact_overview_summaries",values:[!0,!1]},show_climate_air_quality:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_climate_air_quality",values:[!0,!1]},hide_completed_todos:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_completed_todos",values:[!0,!1]},show_window_contacts_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_window_contacts_in_rooms",values:[!0,!1]},show_door_contacts_in_rooms:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_door_contacts_in_rooms",values:[!0,!1]},use_default_area_sort:{kind:"boolean",defaultValue:!1,labelKey:"editor.use_default_area_sort",values:[!0,!1]},room_pins_show_state:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_state",values:[!0,!1]},room_pins_hide_last_changed:{kind:"boolean",defaultValue:!1,labelKey:"editor.hide_last_changed",values:[!0,!1]},overview_max_columns:{kind:"select",defaultValue:3,labelKey:"editor.overview_max_columns",values:[1,2,3,4]},overview_area_card_columns:{kind:"select",defaultValue:"full",labelKey:"editor.overview_area_card_columns",values:["full",6,4]},weather_start_weather_mode:{kind:"select",labelKey:"editor.weather_start_weather_mode",values:["full","compact_hourly"]},weather_start_date_card:{kind:"select",defaultValue:"button-card",labelKey:"editor.weather_start_date_card",values:["button-card","markdown"]},battery_critical_threshold:{kind:"number",defaultValue:20,labelKey:"editor.battery_critical_below",min:0,max:100},battery_low_threshold:{kind:"number",defaultValue:50,labelKey:"editor.battery_low_below",min:0,max:100},camera_renderer:{kind:"select",defaultValue:"native",labelKey:"editor.camera_renderer",values:["native","webrtc"]},camera_pause_when_hidden:{kind:"boolean",defaultValue:!1,labelKey:"editor.camera_pause_when_hidden",values:[!0,!1],dependencies:[{option:"camera_renderer",value:"native"},{option:"camera_live_toggle",value:!0}]},show_cctv_view:{kind:"boolean",defaultValue:!1,labelKey:"editor.show_cctv_view",values:[!0,!1],aliases:P.G.show_cctv_view},show_maintenance_view:{kind:"boolean",labelKey:"editor.show_maintenance_view",values:[!0,!1],aliases:P.G.show_maintenance_view},house_mode_entity:{kind:"entity",labelKey:"editor.house_mode_entity"},alarm_entity:{kind:"entity",labelKey:"editor.alarm_entity"},weather_entity:{kind:"entity",labelKey:"editor.weather_entity"},power_badge_entity:{kind:"entity",labelKey:"editor.power_badge_entity"}};function E(e){return q[e]}function D(e,t,a){return"weather_start_weather_mode"===e?(0,W.EB)(t)?"compact_hourly":"full":E(e)?.defaultValue??a}var L=a(9787),V=a(5609),K=a(5374),I=a(2659),z=a(850),F=a(245),H=a(9829);const Y=/^[a-z_]+\.[a-z0-9_]+$/,T=new Set(["entity","entity_id","entities","camera_image","room_pin_entities","quick_action_entities","favorites","light_favorites","additional","hidden","temperature_sensor","humidity_sensor"]);class M{analyze(e){return this._analysis&&e===this._config||(this._config=e,this._analysis=function(e){(0,V.DB)("diagnostics-analysis");const t=[],a=[],i=[],o=new WeakSet,r=e&&"object"==typeof e?e:{},n=new WeakSet,d=(e,a,i)=>{"string"==typeof e&&Y.test(e)?t.push({entityId:e,path:a,purpose:i}):Array.isArray(e)&&!n.has(e)&&(n.add(e),e.forEach((e,t)=>d(e,`${a}[${t}]`,i)),n.delete(e))},c=(e,t)=>{a.push({code:e,severity:"info",path:t})},l=(e,t,a=0)=>{if(!(!e||"object"!=typeof e||a>50||o.has(e))){if(o.add(e),Array.isArray(e))e.forEach((e,i)=>l(e,`${t}[${i}]`,a+1));else{const o=e;if("custom:advanced-camera-card"===o.type){const e=o.live;!0===e?.preload&&Array.isArray(e.auto_pause)&&0===e.auto_pause.length&&c("camera_preload",t)}for(const[e,r]of Object.entries(o)){if(e.startsWith("_")||"parsed_config"===e&&"string"==typeof o.yaml)continue;const n=t?`${t}.${e}`:e;if("navigation_path"===e&&"string"==typeof r&&/^[a-z][a-z0-9_-]*$/.test(r)&&i.push({path:n,target:r}),"yaml"===e&&"string"==typeof r){(0,V.DB)("diagnostics-yaml");const e=s();try{l(e.load(r),n,a+1)}catch{}}else("entity"===E(e)?.kind||T.has(e)||e.endsWith("_entity")||e.endsWith("_entities")||e.endsWith("_entity_id"))&&d(r,n,"hidden"===e?"exclusion":"display"),l(r,n,a+1)}}o.delete(e)}};l(e,""),(Array.isArray(r.weather_start_layout_items)?r.weather_start_layout_items:[]).forEach((e,t)=>{if(!e||e.yaml||e.parsed_config)return;const a=`weather_start_layout_items[${t}]`;"house_mode"!==e.type||r.house_mode_entity||c("house_mode_unconfigured",a),"custom_card"!==e.type||r.custom_cards?.some(t=>t.id===e.custom_card_id)||c("layout_reference",a),"custom_section"!==e.type||r.custom_sections?.some(t=>t.id===e.custom_section_id)||c("layout_reference",a)});for(const[e,t]of Object.entries(r.areas_options??{}))t?.view_override&&c("room_override",`areas_options.${e}.view_override`);return{references:t,hints:a,links:i,config:r}}(e)),this._analysis}inspect(e,t){return function(e,t){const a=[...e.hints];if(e.links.length){const i=(0,K.V$)(e.config,t);for(const t of e.links)i.has(t.target)||a.push({code:"navigation_target",severity:"warning",path:t.path})}for(const[i,o]of(e.config.weather_start_layout_items??[]).entries())o.yaml||o.parsed_config||("area"===o.type&&o.area_id&&!t.areas[o.area_id]||"floor"===o.type&&o.floor_id&&!t.floors[o.floor_id])&&a.push({code:"layout_reference",severity:"info",path:`weather_start_layout_items[${i}]`});const i=e=>"exclusion"===e.purpose&&!e.path.includes("groups_options.badges"),o=new Set(e.references.filter(i).map(e=>e.entityId));let r;return[...a,...R(e.config,t,o),...(0,H.O)(e.config,t).map(({path:e,entityId:t})=>({code:"option_label_excluded",severity:"warning",path:e,entityId:t})),...e.references.flatMap(a=>{if(i(a)&&(0,z.uo)(t,a.entityId,(a=>{if(a.startsWith("climate.")&&!1!==e.config.hide_grouped_climate_members)return r??(r=(0,z.BC)(t,o))})(a.entityId)))return[{code:"redundant_exclusion",severity:"info",path:a.path,entityId:a.entityId}];const s=t.entities[a.entityId],n=t.states[a.entityId];let d;return s?.disabled_by?d="disabled":n?"unavailable"===n.state?d="unavailable":"unknown"!==n.state||(0,I.bu)(a.entityId)||(d="unknown"):d=s?"no_state":"missing",!d||"exclusion"===a.purpose&&"missing"!==d?[]:[{code:`entity_${d}`,severity:"exclusion"===a.purpose?"info":"missing"===d?"error":"warning",path:a.path,entityId:a.entityId,status:d}]})]}(this.analyze(e),t)}}function R(e,t,a){const i=new Set(e.areas_display?.hidden??[]),o=[];for(const r of Object.values(t.areas??{})){if(i.has(r.area_id))continue;const s=`areas_options.${r.area_id}`;let n;for(const i of["temperature","humidity"]){const d="temperature"===i?r.temperature_entity_id:r.humidity_entity_id;if(!d)continue;const c=(0,_.po)(t,d);if(c){n??(n=(0,F.NS)(r.area_id,t,e));const a=!!(0,_.yJ)(r,i,t,n);o.push(a?{code:"area_sensor_replaced",severity:"info",path:s,entityId:d}:{code:`area_sensor_${c}`,severity:"warning",path:s,entityId:d})}else(a.has(d)||(0,z.uo)(t,d))&&o.push({code:"area_sensor_override",severity:"info",path:s,entityId:d})}}return o}function j(e,t){const a=e.entities[t]?.entity_category;return"config"===a||"diagnostic"===a}var B=a(6217),N=a(2654),G=(a(7773),a(2563)),U=a(880);const J=[{labelKey:"editor.section_overview",panels:["overview","summaries","overviewSections","favorites","appearance","details","sectionOrder"]},{labelKey:"editor.section_areas_rooms",panels:["areas","areaOptions","roomPins","views"]},{labelKey:"editor.section_advanced",panels:["advanced","customContent"]}],Z={overview:{key:"overview",icon:"mdi:view-dashboard-outline",labelKey:"editor.section_overview"},summaries:{key:"summaries",icon:"mdi:counter",labelKey:"editor.section_summaries"},favorites:{key:"favorites",icon:"mdi:star-outline",labelKey:"editor.section_favorites"},areas:{key:"areas",icon:"mdi:floor-plan",labelKey:"editor.section_areas_rooms"},appearance:{key:"appearance",icon:"mdi:palette-outline",labelKey:"editor.section_overview_details"},details:{key:"details",icon:"mdi:tune-variant",labelKey:"editor.section_summary_details"},areaOptions:{key:"area-options",icon:"mdi:home-cog-outline",labelKey:"editor.section_areas"},roomPins:{key:"room-pins",icon:"mdi:pin-outline",labelKey:"editor.section_room_pins"},views:{key:"views",icon:"mdi:tab",labelKey:"editor.section_views"},advanced:{key:"advanced-options",icon:"mdi:cog-outline",labelKey:"editor.section_advanced_options"},sectionOrder:{key:"section-order",icon:"mdi:sort",labelKey:"editor.section_order"},overviewSections:{key:"overview-sections",icon:"mdi:view-grid-outline",labelKey:"editor.section_overview_sections"},customContent:{key:"custom-content",icon:"mdi:view-grid-plus-outline",labelKey:"editor.section_custom_content"}};function X(e){const t=Z[e];return{key:t.key,icon:t.icon,label:(0,A.kg)(t.labelKey)}}const Q={weather_entity:"overview",overview_max_columns:"overview",overview_area_card_columns:"overview",weather_start_weather_mode:"overview",weather_start_date_card:"overview",show_light_summary:"summaries",show_covers_summary:"summaries",show_security_summary:"summaries",show_climate_summary:"summaries",show_battery_summary:"summaries",show_windows_summary:"summaries",compact_overview_summaries:"summaries",show_person_badges:"appearance",show_unavailable_alert_badge:"appearance",show_now_playing_badge:"appearance",show_sun_badge:"appearance",show_updates_badge:"appearance",show_clock_card:"appearance",show_search_card:"appearance",house_mode_entity:"appearance",alarm_entity:"appearance",power_badge_entity:"appearance",show_security_view:"details",group_security_by_areas:"details",hide_hidden_areas_in_security:"details",show_security_activity:"details",show_light_view:"details",group_lights_by_floors:"details",group_lights_by_areas:"details",nested_light_groups:"details",show_covers_view:"details",group_covers_by_floors:"details",group_covers_by_areas:"details",show_partially_open_covers:"details",show_climate_view:"details",show_climate_air_quality:"details",show_battery_view:"details",show_area_in_battery_view:"details",group_batteries_by_areas:"details",hide_mobile_app_batteries:"details",hide_battery_notes_entities:"details",battery_critical_threshold:"details",battery_low_threshold:"details",hide_unavailable_entities:"advanced",dense_section_placement:"advanced",hide_completed_todos:"advanced",favorites_show_state:"favorites",favorites_hide_last_changed:"favorites",room_pins_show_state:"roomPins",room_pins_hide_last_changed:"roomPins",group_by_floors:"areaOptions",show_switches_on_areas:"areaOptions",show_alerts_on_areas:"areaOptions",show_locks_in_rooms:"areaOptions",show_automations_in_rooms:"areaOptions",show_scripts_in_rooms:"areaOptions",show_vacuums_section_in_rooms:"areaOptions",show_switches_section_in_rooms:"areaOptions",show_helpers_section_in_rooms:"areaOptions",show_sensors_section_in_rooms:"areaOptions",show_cover_controls_in_rooms:"areaOptions",show_cameras_in_rooms:"areaOptions",camera_live_toggle:"areaOptions",camera_pause_when_hidden:"areaOptions",show_energy_in_rooms:"areaOptions",show_ups_in_rooms:"areaOptions",hide_grouped_climate_members:"areaOptions",show_window_contacts_in_rooms:"areaOptions",show_door_contacts_in_rooms:"areaOptions",use_default_area_sort:"areaOptions",show_cctv_view:"views",show_maintenance_view:"views",camera_renderer:null},ee=[{key:"favorite_entities",labelKey:"editor.section_favorites",panel:"favorites"},{key:"light_favorite_entities",labelKey:"editor.section_favorites",panel:"favorites"},{key:"room_pin_entities",labelKey:"editor.section_room_pins",panel:"roomPins"},{key:"areas_display",labelKey:"editor.section_areas_rooms",panel:"areas"},{key:"areas_options",labelKey:"editor.section_areas",panel:"areaOptions"},{key:"custom_views",labelKey:"editor.section_views",panel:"views"},{key:"custom_cards",labelKey:"editor.section_custom_content",panel:"customContent"},{key:"custom_sections",labelKey:"editor.section_custom_content",panel:"customContent"},{key:"custom_badges",labelKey:"editor.section_custom_content",panel:"customContent"},{key:"sections_order",labelKey:"editor.section_order",panel:"sectionOrder"},{key:"weather_start_order",labelKey:"editor.section_order",panel:"sectionOrder"},{key:"weather_start_layout_items",labelKey:"editor.section_order",panel:"sectionOrder"}];function te(e){return e.normalize("NFD").replace(/\p{M}/gu,"").toLowerCase()}function ae(e){const t=(0,A.kg)(e);return t===e?"":t}function ie(e,t){const a=function(e,t){const a=e;if(void 0!==a[t])return a[t];for(const e of P.G[t]??[])if(void 0!==a[e])return a[e]}(e,t);if(null==a||""===a)return!1;if(Array.isArray(a))return a.length>0;if("object"==typeof a)return Object.keys(a).length>0;const i=E(t);if(!i)return!0;if("entity"===i.kind)return!0;const o=D(t,e);return void 0===o||a!==o}const oe=[$.AH`
  :host {
    display: block;
  }
  .panel-title {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .custom-item {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  @media (max-width: 480px) {
    :host .form-row {
      flex-direction: column;
      align-items: stretch;
    }
    :host .form-row > select,
    :host .form-row > input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      flex: none !important;
    }
    :host .form-row > label {
      min-width: 0 !important;
      overflow-wrap: anywhere;
    }
  }
`,$.AH`
    /* -- Base layout --------------------------------------------------- */
    .card-config {
      padding: 16px;
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      font-size: var(--mdc-typography-body1-font-size, 14px);
      color: var(--primary-text-color);
    }
    .panel-navigation {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
      padding: 12px 16px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color, #fff);
    }
    .panel-navigation label {
      font-weight: 500;
    }
    .panel-navigation select {
      min-width: 0;
      max-width: 100%;
      flex: 1 1 220px;
      padding: 7px 9px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    .option-search {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
      padding: 12px 16px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color, #fff);
    }
    .option-search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    .option-search-results {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 320px;
      margin: 0;
      padding: 0;
      overflow: auto;
      list-style: none;
    }
    .option-search-result {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .option-search-result:disabled {
      opacity: 0.7;
      cursor: default;
    }
    .option-search-result:hover:not(:disabled),
    .option-search-result:focus-visible {
      border-color: var(--primary-color);
    }
    .option-search-meta {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .section {
      margin-bottom: 16px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 16px;
      transition: box-shadow 0.2s ease;
    }
    .section.panel {
      padding: 0;
      overflow: visible;
    }
    .section.panel.collapsed {
      overflow: hidden;
    }
    .panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 13px 16px;
      background: none;
      border: none;
      cursor: pointer;
      font: inherit;
      color: var(--primary-text-color);
      text-align: left;
    }
    .panel-header:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .panel-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }
    .panel-title {
      flex: 1;
      font-size: 15px;
      font-weight: 500;
    }
    .panel-chevron {
      --mdc-icon-size: 22px;
      color: var(--secondary-text-color);
      transition: transform 0.2s ease;
    }
    .panel.collapsed .panel-chevron {
      transform: rotate(-90deg);
    }
    .panel-body {
      padding: 12px 16px 16px;
      border-top: 1px solid var(--divider-color, #e8e8e8);
    }
    .section-title {
      font-size: 15px;
      font-weight: 500;
      margin: 0 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color, #e8e8e8);
      color: var(--primary-text-color);
      letter-spacing: 0.01em;
    }

    /* -- Form rows ----------------------------------------------------- */
    .form-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .form-row input[type='checkbox'],
    .form-row input[type='radio'] {
      margin-right: 8px;
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .form-row input[type='checkbox']:disabled,
    .form-row input[type='radio']:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .form-row label {
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .form-row label.disabled-label {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .form-row .alarm-select {
      flex: 1;
      max-width: 300px;
    }
    .description {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 2px 0 12px 26px;
      line-height: 1.4;
    }
    .description strong {
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .option-groups {
      display: grid;
      gap: 12px;
      margin-bottom: 14px;
    }
    .option-group {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px;
      background: var(--secondary-background-color);
    }
    .option-group-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .option-group-title ha-icon {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }
    .option-group .description {
      margin-bottom: 10px;
    }
    .option-group .description:last-child {
      margin-bottom: 0;
    }

    /* -- Native <select> — HA-like ------------------------------------- */
    select,
    .form-row select {
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      padding: 10px 32px 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background-color: var(--card-background-color);
      color: var(--primary-text-color);
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%236e6e6e' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      transition: border-color 0.2s ease;
    }
    select:focus,
    .form-row select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    select:hover,
    .form-row select:hover {
      border-color: var(--primary-color);
    }

    /* -- Native <input type="text/number"> — HA-like ------------------- */
    input[type='text'],
    input[type='number'] {
      font-family: inherit;
      font-size: 14px;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }
    input[type='text']:focus,
    input[type='number']:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    input[type='text']:hover,
    input[type='number']:hover {
      border-color: var(--primary-color);
    }
    input[type='text']::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    /* -- Native <textarea> — YAML editors ------------------------------ */
    textarea {
      font-family: 'Roboto Mono', 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
      font-size: 12px;
      line-height: 1.5;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      resize: vertical;
      min-height: 80px;
      box-sizing: border-box;
      transition: border-color 0.2s ease;
      tab-size: 2;
    }
    textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    textarea:hover {
      border-color: var(--primary-color);
    }
    textarea::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.7;
      font-family: inherit;
    }

    /* -- Buttons — HA-like --------------------------------------------- */
    button {
      font-family: inherit;
      font-size: 14px;
    }
    .btn-primary {
      padding: 10px 20px;
      border-radius: var(--ha-card-border-radius, 12px);
      border: none;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      font-weight: 500;
      transition:
        opacity 0.2s ease,
        box-shadow 0.2s ease;
      white-space: nowrap;
    }
    .btn-primary:hover {
      opacity: 0.85;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }
    .btn-primary:active {
      opacity: 0.75;
    }
    .btn-remove {
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 14px;
      transition:
        color 0.2s ease,
        border-color 0.2s ease;
      line-height: 1;
    }
    .btn-remove:hover {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      transition: color 0.15s ease;
    }
    .icon-btn:hover {
      color: var(--primary-text-color);
    }
    .text-btn {
      background: none;
      border: 1px solid var(--divider-color);
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      transition:
        color 0.15s ease,
        border-color 0.15s ease;
    }
    .text-btn:hover {
      color: var(--primary-text-color);
      border-color: var(--primary-color);
    }

    /* -- Area list ----------------------------------------------------- */
    .area-list {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
    }
    .area-item {
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color);
    }
    .area-item:last-child {
      border-bottom: none;
    }
    .area-item.dragging {
      opacity: 0.5;
    }
    .area-item.drag-over {
      border-top: 2px solid var(--primary-color);
    }
    .area-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
    }
    .drag-handle {
      margin-right: 12px;
      color: var(--secondary-text-color);
      cursor: grab;
      user-select: none;
      padding: 4px;
    }
    .drag-handle:active {
      cursor: grabbing;
    }
    .area-checkbox {
      margin-right: 12px;
      accent-color: var(--primary-color);
    }
    .area-name {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
    .area-icon {
      margin-left: 8px;
      margin-right: 12px;
      color: var(--secondary-text-color);
    }
    .nav-pin-button {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      opacity: 0.4;
      transition:
        opacity 0.15s,
        color 0.15s;
      display: flex;
      align-items: center;
    }
    .nav-pin-button.pinned {
      color: var(--primary-color);
      opacity: 1;
    }
    .nav-pin-button:hover:not(:disabled) {
      opacity: 1;
    }
    .nav-pin-button:disabled {
      opacity: 0.2;
      cursor: not-allowed;
    }
    .expand-button {
      background: none;
      border: none;
      padding: 4px 8px;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: transform 0.2s;
    }
    .expand-button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .expand-button.expanded .expand-icon {
      transform: rotate(90deg);
    }
    .expand-icon {
      display: inline-block;
      transition: transform 0.2s;
    }
    .area-content {
      padding: 0 12px 12px 48px;
      background: var(--secondary-background-color);
    }
    .loading-placeholder {
      padding: 12px;
      text-align: center;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    /* -- Section order list --------------------------------------------- */
    .section-order-list {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
    }
    .section-order-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color);
      transition: opacity 0.2s;
    }
    .section-order-item:last-child {
      border-bottom: none;
    }
    .section-order-item.dragging {
      opacity: 0.4;
    }
    .section-order-item.drag-over {
      border-top: 2px solid var(--primary-color);
    }
    .section-order-item.disabled {
      opacity: 0.5;
    }
    .section-order-item .drag-handle {
      margin-right: 12px;
      color: var(--secondary-text-color);
      cursor: grab;
      user-select: none;
      padding: 4px;
    }
    .section-order-item .drag-handle:active {
      cursor: grabbing;
    }
    .section-order-item .section-icon {
      margin-right: 10px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }
    .section-order-item .section-label {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
    .stack-move-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      min-height: 40px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .stack-move-button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .stack-move-button:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .section-order-item .section-hidden-tag {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-style: italic;
      margin-left: 8px;
    }
    .section-order-compact {
      margin-top: 8px;
      padding: 10px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
    }
    .compact-title {
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .compact-chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .compact-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 999px;
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      font-size: 12px;
      border: 1px solid var(--divider-color);
    }
    .compact-chip ha-icon {
      --mdc-icon-size: 14px;
    }

    /* -- Entity groups ------------------------------------------------- */
    .entity-groups {
      padding-top: 8px;
    }
    .entity-group {
      margin-bottom: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      overflow: hidden;
    }
    .entity-group-header {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.15s ease;
    }
    .entity-group-header:hover {
      background: var(--secondary-background-color);
    }
    .group-checkbox {
      margin-right: 8px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .group-checkbox[data-indeterminate='true'] {
      opacity: 0.6;
    }
    .entity-group-header ha-icon {
      margin-right: 8px;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }
    .group-name {
      flex: 1;
      font-weight: 500;
      font-size: 14px;
    }
    .entity-count {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-right: 8px;
    }
    .expand-button-small {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
    }
    .expand-button-small.expanded .expand-icon-small {
      transform: rotate(90deg);
    }
    .expand-icon-small {
      display: inline-block;
      font-size: 12px;
      transition: transform 0.2s;
    }

    /* -- Entity list --------------------------------------------------- */
    .entity-list {
      padding: 8px 12px 8px 36px;
      border-top: 1px solid var(--divider-color);
    }
    .entity-item {
      display: flex;
      align-items: center;
      padding: 6px 0;
    }
    .entity-checkbox {
      margin-right: 8px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .entity-name {
      flex: 1;
      font-size: 14px;
    }
    .entity-id {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-family: 'Roboto Mono', monospace;
      margin-left: 8px;
    }
    .empty-state {
      padding: 24px;
      text-align: center;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    /* -- Badge entity management --------------------------------------- */
    .badge-separator {
      padding: 8px 0 4px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      border-top: 1px dashed var(--divider-color);
      margin-top: 4px;
    }
    .badge-additional-item {
      padding-left: 0;
    }
    .badge-remove-btn {
      background: none;
      border: none;
      padding: 2px 6px;
      cursor: pointer;
      color: var(--error-color, #db4437);
      font-size: 14px;
      margin-left: 8px;
      border-radius: 4px;
      transition: background-color 0.15s ease;
    }
    .badge-remove-btn:hover {
      background: var(--secondary-background-color);
    }
    .badge-add-section {
      display: flex;
      gap: 8px;
      padding: 8px 0 4px;
      align-items: center;
    }
    .badge-entity-picker {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .badge-add-button {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      transition: opacity 0.2s ease;
    }
    .badge-add-button:hover {
      opacity: 0.85;
    }
    .badge-name-checkbox {
      margin-left: auto;
      margin-right: 2px;
      width: 14px;
      height: 14px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .badge-name-label {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-right: 8px;
      white-space: nowrap;
    }

    /* -- Entity search picker ------------------------------------------ */
    .entity-search-picker {
      position: relative;
      flex: 1;
      min-width: 0;
    }
    .entity-search-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.2s ease;
    }
    .entity-search-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
    .entity-search-input::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.7;
    }
    .entity-search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
      margin-top: 4px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      overflow: hidden;
      max-height: 320px;
      overflow-y: auto;
    }
    .entity-search-result {
      display: flex;
      flex-direction: column;
      padding: 10px 14px;
      cursor: pointer;
      transition: background-color 0.1s ease;
      border-bottom: 1px solid var(--divider-color);
    }
    .entity-search-result:last-child {
      border-bottom: none;
    }
    .entity-search-result:hover {
      background: var(--secondary-background-color);
    }
    .entity-search-result .entity-search-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .entity-search-result .entity-search-id {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-family: 'Roboto Mono', monospace;
      margin-top: 2px;
    }
    .entity-search-no-results {
      padding: 12px 14px;
      color: var(--secondary-text-color);
      font-style: italic;
      font-size: 13px;
    }

    /* -- Favorites / Room Pins list items ------------------------------ */
    .entity-list-container {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
    }
    .entity-list-item {
      display: flex;
      align-items: center;
      padding: 10px 14px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color);
      transition: background-color 0.1s ease;
    }
    .entity-list-item:last-child {
      border-bottom: none;
    }
    .entity-list-item:hover {
      background: var(--secondary-background-color);
    }
    .entity-list-item .drag-icon {
      margin-right: 12px;
      color: var(--secondary-text-color);
      font-size: 16px;
      cursor: grab;
      user-select: none;
      padding: 4px;
    }
    .entity-list-item .drag-icon:active {
      cursor: grabbing;
    }
    .entity-list-item.dragging {
      opacity: 0.5;
    }
    .entity-list-item.drag-over {
      border-top: 2px solid var(--primary-color);
    }
    .entity-list-item .item-info {
      flex: 1;
      min-width: 0;
      font-size: 14px;
    }
    .entity-list-item .item-name {
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .entity-list-item .item-entity-id {
      margin-left: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-family: 'Roboto Mono', monospace;
    }
    .entity-list-item .item-area {
      display: block;
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }

    /* -- Custom view/card/badge items ---------------------------------- */
    .custom-item {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 16px;
      margin-bottom: 12px;
      background: var(--card-background-color);
    }
    .custom-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .custom-item-header strong {
      font-size: 14px;
      font-weight: 500;
    }
    .custom-item-fields {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .area-custom-card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .custom-card-target {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
    .custom-card-target label {
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .custom-card-target select {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .custom-item-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      min-width: 0;
    }
    .custom-item-row > * {
      min-width: 0;
    }
    .weather-start-add-row {
      align-items: stretch;
      margin-top: 10px;
    }
    .weather-start-add-row .btn-primary {
      flex: 0 1 auto;
      padding: 10px 14px;
    }
    .weather-start-add-row select {
      flex: 1 1 180px;
      min-width: 160px;
    }
    .custom-item-validation {
      font-size: 12px;
      min-height: 16px;
    }
    .custom-content-grid {
      display: grid;
      gap: 12px;
    }
    .editor-subsection {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      padding: 12px;
    }
    .subsection-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .subsection-title a {
      margin-left: auto;
      color: var(--primary-color);
      text-decoration: none;
      font-size: 16px;
    }

    /* -- Section dividers ---------------------------------------------- */
    .section-divider {
      margin: 28px 0 12px;
      padding: 0;
    }
    .section-divider-title {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--secondary-text-color);
    }

    /* -- Mobile responsive --------------------------------------------- */
    @media (max-width: 600px) {
      .card-config {
        padding: 12px 8px;
      }
      .section {
        margin-bottom: 16px;
      }
      .section-title {
        font-size: 15px;
        margin-bottom: 8px;
      }
      .form-row {
        flex-wrap: wrap;
        gap: 4px;
      }
      .form-row label {
        font-size: 13px;
      }
      .description {
        margin-left: 26px;
        margin-bottom: 12px;
        font-size: 11px;
      }

      select,
      .form-row select {
        width: 100%;
        min-width: 0;
        font-size: 13px;
        padding: 8px 28px 8px 10px;
      }
      input[type='text'],
      input[type='number'] {
        width: 100%;
        font-size: 13px;
        padding: 8px 10px;
      }
      textarea {
        font-size: 11px;
        padding: 10px;
        min-height: 60px;
      }

      .entity-search-picker {
        width: 100%;
      }
      .entity-search-results {
        max-height: 240px;
      }
      .entity-search-result {
        padding: 8px 10px;
      }

      .area-header {
        padding: 10px 12px;
      }
      .area-content {
        padding: 0 8px 8px 24px;
      }
      .entity-list {
        padding: 6px 8px 6px 16px;
      }

      .custom-item {
        padding: 12px;
      }
      .custom-item-row {
        flex-direction: column;
      }
      .weather-start-add-row .btn-primary,
      .weather-start-add-row select {
        width: 100%;
      }

      .entity-list-item {
        padding: 8px 10px;
      }
      .entity-list-item .item-entity-id {
        display: block;
        margin-left: 0;
        margin-top: 2px;
      }

      .badge-add-section {
        flex-wrap: wrap;
      }

      .btn-primary {
        padding: 8px 16px;
        font-size: 13px;
      }
    }

    /* -- Card Picker Overlay -------------------------------------------- */
    .card-picker-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .card-picker-dialog {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      width: 100%;
      max-width: 560px;
      max-height: 82vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    .card-picker-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
      flex-shrink: 0;
    }
    .card-picker-header-title {
      flex: 1;
      font-weight: 500;
      font-size: 15px;
      color: var(--primary-text-color);
    }
    .card-picker-icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      line-height: 1;
      transition: color 0.15s ease;
    }
    .card-picker-icon-btn:hover {
      color: var(--primary-text-color);
    }
    .card-picker-search-row {
      padding: 10px 16px 6px;
      flex-shrink: 0;
    }
    .card-picker-search-row input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
      outline: none;
    }
    .card-picker-search-row input:focus {
      border-color: var(--primary-color);
    }
    .card-type-grid {
      flex: 1;
      overflow-y: auto;
      padding: 8px 16px 16px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .card-type-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px 6px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      cursor: pointer;
      gap: 6px;
      transition:
        border-color 0.15s ease,
        background 0.15s ease;
      font-family: inherit;
      min-height: 72px;
    }
    .card-type-btn:hover {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
    }
    .card-type-btn ha-icon {
      color: var(--primary-color);
    }
    .card-type-btn span {
      font-size: 11px;
      color: var(--primary-text-color);
      text-align: center;
      line-height: 1.3;
    }
    .card-editor-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .card-editor-visual-host {
      display: block;
    }
    .card-editor-yaml-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .card-editor-yaml-area {
      width: 100%;
      box-sizing: border-box;
      min-height: 160px;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-size: 12px;
      font-family: monospace;
      resize: vertical;
      outline: none;
    }
    .card-editor-yaml-area:focus {
      border-color: var(--primary-color);
    }
    .card-picker-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid var(--divider-color);
      flex-shrink: 0;
    }
    .btn-secondary {
      padding: 10px 20px;
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-weight: 500;
      font-family: inherit;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }
    .btn-secondary:hover {
      border-color: var(--primary-color);
    }
    .advanced-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      text-align: left;
    }
    .advanced-toggle ha-icon:last-child {
      margin-left: auto;
      transition: transform 0.2s ease;
    }
    .advanced-toggle[aria-expanded='true'] ha-icon:last-child {
      transform: rotate(180deg);
    }
    /* -- Option panels (labelled selects, grouped options) ------------- */
    .form-row > .form-label {
      margin-right: 8px;
      min-width: 120px;
    }
    .form-row > .form-control {
      flex: 1;
      min-width: 0;
    }
    .description.description-intro {
      margin-left: 0;
    }
    .form-row .row-icon {
      --mdc-icon-size: 18px;
      margin-right: 6px;
      color: var(--secondary-text-color);
      vertical-align: middle;
    }
    .description + .subsection-title,
    .form-row + .subsection-title,
    ha-textfield + .subsection-title {
      margin-top: 18px;
    }
    .description + .option-group-title,
    .form-row + .option-group-title {
      margin-top: 14px;
    }
    .advanced-content {
      margin-top: 16px;
      padding-left: 12px;
      border-left: 3px solid var(--divider-color);
    }
  `];function re(e,t,a=!1){const i=Reflect.get(e,t);return a?!1!==i:!0===i}function se(e,t,a={}){const i=!0===a.defaultOn;return $.qy`
    ${e.checkbox(a.id??t.replace(/_/g,"-"),(0,A.kg)(a.labelKey??`editor.${t}`),re(e.config,t,i),a=>e.toggle(t,a,i),!0===a.disabled)}
    ${!1===a.description?"":$.qy`<div class="description">${(0,A.kg)(`editor.${t}_desc`)}</div>`}
  `}function ne(e,t){return[...new Set(e.split(",").map(e=>e.trim()).filter(t))]}function de(e){return $.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_custom_content")}</div>
      <div class="description" style="margin-left: 0; margin-bottom: 12px;">
        ${(0,A.kg)("editor.section_custom_content_desc")}
      </div>
      ${$.qy`
              <div class="empty-state" style="margin-bottom: 12px;">
                ${(0,A.kg)("editor.custom_content_weather_start_hint")}
              </div>
            `}
      <div class="custom-content-grid">
        ${$.s6}
        ${$.s6} ${function(e,t=!1){const a=e._config.custom_badges||[];return $.qy`
    <div class=${t?"editor-subsection":"section"}>
      <div class=${t?"subsection-title":"section-title"} style="display: flex; align-items: center; gap: 8px;">
        ${(0,A.kg)("editor.section_custom_badges")}
        <a
          href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-Badges-hinzufugen.gif"
          target="_blank"
          rel="noopener"
          style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
          title=${(0,A.kg)("editor.video_tutorial")}
          >&#x1F3AC;</a
        >
      </div>

      <div id="custom-badges-list">
        ${0===a.length?$.qy`<div class="empty-state">${(0,A.kg)("editor.no_custom_badges")}</div>`:a.map((t,a)=>function(e,t,a){return $.qy`
    <div class="custom-item" data-index=${a}>
      <div class="custom-item-header">
        <strong>Badge ${a+1}</strong>
        <button class="btn-remove" @click=${()=>e._removeCustomBadge(a)}>&#x2715;</button>
      </div>
      <textarea
        rows="4"
        placeholder="type: entity&#10;entity: sun.sun"
        .value=${t.yaml||""}
        style="width: 100%;"
        @change=${t=>e._updateCustomBadgeYaml(a,t.target.value)}
      ></textarea>
      <div class="custom-item-validation">${i=t,i._yaml_error?$.qy`<span style="color: var(--error-color);">&#x274C; ${i._yaml_error}</span>`:i.yaml?$.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,A.kg)("editor.yaml_valid")}</span>`:$.s6}</div>
    </div>
  `;var i}(e,t,a))}
      </div>

      <button class="btn-primary" style="margin-top: 8px;" @click=${()=>e._addCustomBadge()}>
        ${(0,A.kg)("editor.add_custom_badge")}
      </button>
      <div class="description">${(0,A.kg)("editor.custom_badges_help")}</div>
    </div>
  `}(e,!0)}
        ${function(e,t=!1){const a=e._config.custom_views||[];return $.qy`
    <div class=${t?"editor-subsection":"section"}>
      <div class=${t?"subsection-title":"section-title"} style="display: flex; align-items: center; gap: 8px;">
        ${(0,A.kg)("editor.section_custom_views")}
        <a
          href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-View-hinzufugen.gif"
          target="_blank"
          rel="noopener"
          style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
          title=${(0,A.kg)("editor.video_tutorial")}
          >&#x1F3AC;</a
        >
      </div>

      <div id="custom-views-list">
        ${0===a.length?$.qy`<div class="empty-state">${(0,A.kg)("editor.no_custom_views")}</div>`:a.map((t,a)=>function(e,t,a){const i=void 0!==t.ref_dashboard,o=t._yaml_error?$.qy`<span style="color: var(--error-color);">&#x274C; ${t._yaml_error}</span>`:t.yaml?$.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,A.kg)("editor.yaml_valid")}</span>`:$.s6;return $.qy`
    <div class="custom-item" data-index=${a}>
      <div class="custom-item-header">
        <strong>${t.title||(0,A.kg)("editor.new_view")}</strong>
        <button class="btn-remove" @click=${()=>e._removeCustomView(a)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <div class="custom-item-row">
          <input
            type="text"
            .value=${t.title||""}
            placeholder=${(0,A.kg)("editor.title_placeholder")}
            style="flex: 2;"
            @change=${t=>e._updateCustomViewField(a,"title",t.target.value)}
          />
          <input
            type="text"
            .value=${t.path||""}
            placeholder=${(0,A.kg)("editor.path_placeholder")}
            style="flex: 2;"
            @change=${t=>e._updateCustomViewField(a,"path",t.target.value)}
          />
          <input
            type="text"
            .value=${t.icon||""}
            placeholder="mdi:star"
            style="flex: 1;"
            @change=${t=>e._updateCustomViewField(a,"icon",t.target.value)}
          />
        </div>
        ${function(e,t,a){const i=function(e,t){if(!e._hass)return[];const a=[["home",(0,A.kg)("views.overview")]],i=(e,t,i)=>{e&&a.push([t,(0,A.kg)(i)])};i((0,K.v4)(e._config,"lights"),"lights","views.lights"),i((0,K.v4)(e._config,"covers"),"covers","views.covers"),i((0,K.v4)(e._config,"security"),"security","views.security"),i((0,K.v4)(e._config,"batteries"),"batteries","views.batteries"),i((0,K.v4)(e._config,"climate"),"climate","views.climate"),i(!0===e._config.show_cctv_view,"cctv","views.cctv"),i(!1!==e._config.show_maintenance_view,"maintenance","views.maintenance");const o=new Set(e._config.areas_display?.hidden||[]);for(const t of e._getSortedAreas()){if(o.has(t.area_id))continue;const i=e._config.room_visibility?.[t.area_id];i?.entity&&e._hass.states[i.entity]?.state!==i.state||a.push([t.area_id,t.name])}for(const[i,o]of(e._config.custom_views||[]).entries())i!==t&&(o.parsed_config||o.ref_dashboard&&o.ref_view)&&o.path&&o.title&&a.push([o.path,o.title]);return a}(e,a),o=!!t.after_view&&!i.some(([e])=>e===t.after_view);return $.qy`
    <div class="custom-item-row">
      <select
        style="flex: 1;"
        @change=${t=>e._updateCustomViewAfterView(a,t.target.value)}
      >
        <option value="" ?selected=${!t.after_view}>${(0,A.kg)("editor.custom_view_position_end")}</option>
        ${o?$.qy`<option value=${t.after_view||""} selected>
                &#x26A0; ${(0,A.kg)("editor.custom_view_position_after")} ${t.after_view}
              </option>`:$.s6}
        ${i.map(([e,a])=>$.qy`
            <option value=${e} ?selected=${t.after_view===e}>
              ${(0,A.kg)("editor.custom_view_position_after")} ${a}
            </option>
          `)}
      </select>
    </div>
  `}(e,t,a)}
        ${i?function(e,t,a){if(null===e._refDashboards)return e._loadRefDashboards(),$.qy`<div class="description">${(0,A.kg)("editor.ref_loading")}</div>`;if(0===e._refDashboards.length)return $.qy`<div class="custom-item-validation" style="color: var(--error-color);">
      ${(0,A.kg)("editor.ref_no_dashboards")}
    </div>`;const i=e._refDashboards.find(e=>e.url_path===t.ref_dashboard),o=!!t.ref_dashboard&&!i;return $.qy` <div class="custom-item-row">
      <select
        style="flex: 1;"
        @change=${t=>e._refDashboardChanged(a,t.target.value)}
      >
        <option value="" ?selected=${!t.ref_dashboard} disabled>${(0,A.kg)("editor.ref_select_dashboard")}</option>
        ${o?$.qy`<option value=${t.ref_dashboard||""} selected>${t.ref_dashboard}</option>`:$.s6}
        ${e._refDashboards.map(e=>$.qy` <option value=${e.url_path} ?selected=${e.url_path===t.ref_dashboard}>
              ${e.title}
            </option>`)}
      </select>
      <select
        style="flex: 1;"
        ?disabled=${!i}
        @change=${t=>e._refViewChanged(a,t.target.value)}
      >
        <option value="" ?selected=${!t.ref_view} disabled>${(0,A.kg)("editor.ref_select_view")}</option>
        ${(i?.views||[]).map(e=>{const a=e.path??String(e.index),i=`${e.title||`${(0,A.kg)("editor.ref_view_untitled")} ${e.index+1}`}${e.path?` (${e.path})`:""}`;return $.qy`<option value=${a} ?selected=${a===t.ref_view}>${i}</option>`})}
      </select>
    </div>
    <div class="custom-item-validation">
      ${o?$.qy`<span style="color: var(--error-color);">${(0,A.kg)("editor.ref_dashboard_missing")}</span>`:t.ref_dashboard&&t.ref_view?$.qy`<span style="color: var(--success-color, green);">${(0,A.kg)("editor.ref_valid")}</span>`:(0,A.kg)("editor.ref_incomplete")}
    </div>`}(e,t,a):$.qy`<textarea
                  rows="8"
                  placeholder=${(0,A.kg)("editor.yaml_placeholder")}
                  .value=${t.yaml||""}
                  style="width: 100%;"
                  @change=${t=>e._updateCustomViewYaml(a,t.target.value)}
                ></textarea>
                <div class="custom-item-validation">${o}</div>`}
      </div>
    </div>
  `}(e,t,a))}
      </div>

      <div class="custom-item-row" style="margin-top: 8px;">
        <button class="btn-primary" @click=${e._addCustomView}>
          ${(0,A.kg)("editor.add_custom_view")} <ha-icon icon="mdi:code-braces"></ha-icon>
        </button>
        <button class="btn-primary" @click=${e._addCustomRefView}>
          ${(0,A.kg)("editor.add_custom_view_ref")} <ha-icon icon="mdi:link-variant"></ha-icon>
        </button>
      </div>
      <div class="description">${(0,A.kg)("editor.custom_views_help")}</div>
      <div class="description">${(0,A.kg)("editor.custom_views_ref_help")}</div>
    </div>
  `}(e.customViewsHost,!0)}
      </div>
    </div>
  `}var ce=a(3534);function le(e,t){return e.config[t]||[]}function _e(e,t,a){e.update(e=>{a.length>0?e[t]=a:delete e[t]})}function he(e,t,a){e.entityListState.search[t]=a,e.requestUpdate()}function ue(e){return e.target.closest(".entity-list-item")}function pe(e,t){const{key:a}=t,i=le(e,a),o=new Map(e.entityOptions().map(e=>[e.entity_id,e])),r=t.withArea?new Map(e.sortedAreas().map(e=>[e.area_id,e.name])):new Map,s=e.entityListState.search[a]??"",n=e.filterEntities(s,!0===t.withArea);return $.qy`
    <div id=${t.listId} style="margin-bottom: 12px;">
      ${0===i.length?$.qy`<div class="empty-state">${t.emptyLabel}</div>`:$.qy`
              <div class="entity-list-container">
                ${i.map(i=>{const s=o.get(i),n=s?.area_id||s?.device_area_id;return $.qy`
                    <div
                      class="entity-list-item"
                      data-entity-id=${i}
                      draggable="true"
                      @dragstart=${t=>function(e,t){const a=ue(t);a?(a.classList.add("dragging"),e.entityListState.draggedId=a.dataset.entityId||null,t.dataTransfer&&(t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",e.entityListState.draggedId||""))):t.preventDefault()}(e,t)}
                      @dragend=${t=>function(e,t){ue(t)?.classList.remove("dragging"),e.entityListState.draggedId=null}(e,t)}
                      @dragover=${t=>function(e,t){t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move");const a=t.currentTarget;a.dataset.entityId!==e.entityListState.draggedId&&a.classList.add("drag-over")}(e,t)}
                      @dragleave=${e=>e.currentTarget.classList.remove("drag-over")}
                      @drop=${t=>function(e,t,a){a.stopPropagation(),a.preventDefault();const i=a.currentTarget;i.classList.remove("drag-over");const o=e.entityListState.draggedId,r=i.dataset.entityId;if(!o||!r||o===r)return;const s=[...le(e,t)],n=s.indexOf(o),d=s.indexOf(r);-1!==n&&-1!==d&&(s.splice(n,1),s.splice(d,0,o),_e(e,t,s))}(e,a,t)}
                    >
                      <span class="drag-icon">&#x2630;</span>
                      <span class="item-info">
                        <span class="item-name">${s?.name||i}</span>
                        <span class="item-entity-id">${i}</span>
                        ${t.withArea?$.qy`<span class="item-area"
                                >&#x1F4CD;
                                ${n?r.get(n)||n:(0,A.kg)("editor.no_room")}</span
                              >`:$.s6}
                      </span>
                      <button
                        class="btn-remove"
                        aria-label=${(0,A.kg)("editor.remove_entity")}
                        @click=${()=>function(e,t,a){_e(e,t,le(e,t).filter(e=>e!==a))}(e,a,i)}
                      >
                        &#x2715;
                      </button>
                    </div>
                  `})}
              </div>
            `}
    </div>

    <div class="entity-search-picker">
      <input
        type="text"
        class="entity-search-input"
        placeholder=${(0,A.kg)("editor.select_entity")+"..."}
        aria-label=${(0,A.kg)("editor.select_entity")}
        .value=${s}
        @input=${t=>he(e,a,t.target.value)}
        @blur=${()=>{setTimeout(()=>he(e,a,""),200)}}
      />
      ${s.length>=2?$.qy`
              <div class="entity-search-results">
                ${n.length>0?n.map(t=>$.qy`
                          <div
                            class="entity-search-result"
                            @mousedown=${i=>{i.preventDefault(),function(e,t,a){const i=le(e,t);i.includes(a)||_e(e,t,[...i,a])}(e,a,t.entity_id),he(e,a,"")}}
                          >
                            <span class="entity-search-name">${t.name}</span>
                            <span class="entity-search-id">${t.entity_id}</span>
                          </div>
                        `):$.qy`<div class="entity-search-no-results">${(0,A.kg)("editor.no_results")}</div>`}
              </div>
            `:$.s6}
    </div>
  `}var me=a(6256);const ge=[{name:"image",selector:{media:{accept:["image/*"],clearable:!0,image_upload:!0,hide_content_type:!0}}}];function ve(e,t){const a={...e._config};("string"==typeof t?""!==t:t)?a.background={...a.background||{},image:t}:delete a.background,e._fireConfigChanged(a)}function ye(e,t,a){if(!e._config.background?.image)return;const i={...e._config.background};"opacity"===t?"number"==typeof a&&a<100?i.opacity=a:delete i.opacity:"fixed"===a?i.attachment="fixed":delete i.attachment,e._fireConfigChanged({...e._config,background:i})}const be=["summaries","favorites","light_favorites","quick_actions","areas","areas_other","weather","energy","plants","agenda","todos","persons","vacuums","maintenance","media","timers","activity","custom_cards","custom_sections"];function we(e,t){return e?Object.keys(e.states).filter(t).map(t=>({entity_id:t,name:e.states[t].attributes?.friendly_name||t.split(".")[1].replace(/_/g," ")})).sort((e,t)=>e.name.localeCompare(t.name)):[]}function fe(e,t,a,i,o){return $.qy`
    <div class="form-row">
      <label for=${e} class="form-label">${t}</label>
      <select
        id=${e}
        class="form-control"
        @change=${e=>o(e.target.value)}
      >
        ${i.map(e=>$.qy`<option value=${e.value} ?selected=${e.value===a}>${e.label}</option>`)}
      </select>
    </div>
  `}function ke(e,t,a,i,o){return fe(a,(0,A.kg)(`editor.${t}`),e.config[t]||"",[{value:"",label:i},...o.map(e=>({value:e.entity_id,label:e.name}))],a=>e.update(e=>{a?e[t]=a:delete e[t]}))}function xe(e,t,a){return $.qy`
    <ha-textfield
      .value=${(e.config[t]||[]).join(", ")}
      label=${(0,A.kg)(`editor.${t}`)}
      helper=${(0,A.kg)(`editor.${t}_desc`)}
      @change=${i=>{const o=ne(i.target.value,e=>e.startsWith(a));e.update(e=>{o.length>0?e[t]=o:delete e[t]})}}
    ></ha-textfield>
  `}function Ce(e,t,a){return $.qy`
    <div class="form-row">
      <label for=${a.id} style="min-width: 140px;">${a.label}</label>
      <input
        type="number"
        id=${a.id}
        min=${a.min}
        max=${a.max}
        .value=${String(e.config[t]??a.defaultValue)}
        style="width: 80px;"
        @change=${i=>{const o=parseInt(i.target.value,10);isNaN(o)||o<a.min||o>a.max||e.setOption(t,o,a.defaultValue)}}
      />
      ${a.unit}
    </div>
  `}function $e(e,t,a,i,o){return $.qy`
    <div class="form-row">
      <input type="radio" id=${e} name=${t} ?checked=${i} @change=${o} />
      <label for=${e}>${a}</label>
    </div>
  `}function Se(e,t,a){e.update(e=>{void 0===a?delete e[t]:e[t]=a})}a(4535);const Ae=new Map([["energy",{icon:"mdi:lightning-bolt",labelKey:"stacks.energy"}],["cameras",{icon:"mdi:cctv",labelKey:"stacks.cameras"}],["lights",{icon:"mdi:lightbulb",labelKey:"stacks.lights"}],["locks",{icon:"mdi:lock",labelKey:"stacks.locks"}],["climate",{icon:"mdi:thermostat",labelKey:"stacks.climate"}],["covers",{icon:"mdi:window-shutter",labelKey:"stacks.covers"}],["covers_window",{icon:"mdi:window-open-variant",labelKey:"stacks.covers_window"}],["media",{icon:"mdi:speaker",labelKey:"stacks.media"}],["scenes",{icon:"mdi:palette",labelKey:"stacks.scenes"}],["switches",{icon:"mdi:toggle-switch",labelKey:"stacks.switches"}],["helpers",{icon:"mdi:tune-variant",labelKey:"stacks.helpers"}],["sensors",{icon:"mdi:motion-sensor",labelKey:"stacks.sensors"}],["misc",{icon:"mdi:light-switch",labelKey:"stacks.misc"}],["room_pins",{icon:"mdi:pin",labelKey:"stacks.room_pins"}]]);function Oe(e,t){const a=new Set,i=t=>(e[t]?.length??0)>0;return i("lights")&&a.add("lights"),i("locks")&&a.add("locks"),(i("climate")||i("fan"))&&a.add("climate"),(i("covers")||i("covers_curtain"))&&a.add("covers"),i("covers_window")&&a.add("covers_window"),i("media_player")&&a.add("media"),(i("scenes")||i("automations")||i("scripts"))&&a.add("scenes"),i("switches")&&!0===t.show_switches_section_in_rooms&&a.add("switches"),i("helpers")&&!0===t.show_helpers_section_in_rooms&&a.add("helpers"),i("binary_sensors")&&!0===t.show_sensors_section_in_rooms&&a.add("sensors"),(i("vacuum")||i("switches")&&!0!==t.show_switches_section_in_rooms||i("humidifier")||i("valve")||i("water_heater"))&&a.add("misc"),i("energy")&&a.add("energy"),!1!==t.show_cameras_in_rooms&&a.add("cameras"),a.add("room_pins"),a}function Pe(e,t,a,i){const o={...e._config.room_visibility||{}},r={entity:o[t]?.entity||"",state:o[t]?.state||"",[a]:i.trim()};r.entity||r.state?o[t]=r:delete o[t];const s={...e._config};Object.keys(o).length>0?s.room_visibility=o:delete s.room_visibility,e._fireConfigChanged(s)}function We(e,t,a,i){const o=e.findIndex(e=>t(e)===a),r=e.findIndex(e=>t(e)===i);if(-1===o||-1===r||o===r)return null;const s=[...e],[n]=s.splice(o,1);return s.splice(r,0,n),s}function qe(e){let t=null;return{onDragStart:a=>{const i=a.target,o=i.closest(".drag-handle")?i.closest(e.itemSelector):null;o?(o.classList.add("dragging"),a.dataTransfer&&(a.dataTransfer.effectAllowed="move",a.dataTransfer.setData("text/plain",e.keyOf(o)||"")),t=o):a.preventDefault()},onDragEnd:a=>{a.target.closest(e.itemSelector)?.classList.remove("dragging"),e.clearScope()?.querySelectorAll(e.itemSelector).forEach(e=>e.classList.remove("drag-over")),t=null},onDragOver:e=>{e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const a=e.currentTarget;a!==t&&a.classList.add("drag-over")},onDragLeave:e=>{e.currentTarget.classList.remove("drag-over")},onDrop:a=>{a.stopPropagation(),a.preventDefault();const i=a.currentTarget;if(i.classList.remove("drag-over"),!t||t===i)return;const o=e.keyOf(t),r=e.keyOf(i);o&&r&&e.onReorder(o,r,i)}}}const Ee=new Map(Object.entries({clock:{icon:"mdi:clock-outline",labelKey:"weather_start_blocks.clock"},date:{icon:"mdi:calendar-today",labelKey:"weather_start_blocks.date"},summaries:{icon:"mdi:view-dashboard-outline",labelKey:"weather_start_blocks.summaries"},favorites:{icon:"mdi:star",labelKey:"weather_start_blocks.favorites"},light_favorites:{icon:"mdi:lightbulb-star-outline",labelKey:"weather_start_blocks.light_favorites"},alarm:{icon:"mdi:shield-home",labelKey:"weather_start_blocks.alarm"},house_mode:{icon:"mdi:home-switch-outline",labelKey:"weather_start_blocks.house_mode"},search:{icon:"mdi:magnify",labelKey:"weather_start_blocks.search"},overview:{icon:"mdi:overscan",labelKey:"weather_start_blocks.overview"},weather_current:{icon:"mdi:weather-partly-cloudy",labelKey:"weather_start_blocks.weather_current"},weather_hourly:{icon:"mdi:clock-time-four-outline",labelKey:"weather_start_blocks.weather_hourly"},weather_daily:{icon:"mdi:calendar-week",labelKey:"weather_start_blocks.weather_daily"},weather_details:{icon:"mdi:gauge",labelKey:"weather_start_blocks.weather_details"},energy:{icon:"mdi:lightning-bolt",labelKey:"weather_start_blocks.energy"},plants:{icon:"mdi:flower",labelKey:"weather_start_blocks.plants"},agenda:{icon:"mdi:calendar",labelKey:"weather_start_blocks.agenda"},todos:{icon:"mdi:check-circle-outline",labelKey:"weather_start_blocks.todos"},persons:{icon:"mdi:account-group",labelKey:"weather_start_blocks.persons"},vacuums:{icon:"mdi:robot-vacuum",labelKey:"weather_start_blocks.vacuums"},maintenance:{icon:"mdi:wrench-clock",labelKey:"weather_start_blocks.maintenance"},quick_actions:{icon:"mdi:gesture-tap-button",labelKey:"weather_start_blocks.quick_actions"},media:{icon:"mdi:play-circle-outline",labelKey:"weather_start_blocks.media"},timers:{icon:"mdi:timer-outline",labelKey:"weather_start_blocks.timers"},activity:{icon:"mdi:history",labelKey:"weather_start_blocks.activity"},areas:{icon:"mdi:floor-plan",labelKey:"weather_start_blocks.areas"},custom_cards:{icon:"mdi:cards",labelKey:"weather_start_blocks.custom_cards"},custom_sections:{icon:"mdi:view-grid-plus-outline",labelKey:"weather_start_blocks.custom_sections"}})),De=new Map([["overview",{icon:"mdi:home-outline",labelKey:"sections.overview"}],["custom_cards",{icon:"mdi:cards",labelKey:"sections.custom_cards"}],["areas",{icon:"mdi:floor-plan",labelKey:"sections.areas"}],["weather",{icon:"mdi:weather-partly-cloudy",labelKey:"sections.weather"}],["energy",{icon:"mdi:lightning-bolt",labelKey:"sections.energy"}]]);function Le(e){return De.get(e).labelKey}function Ve(e,t){return e.id||`legacy-custom-card-${t}`}function Ke(e,t){return e.id||`legacy-custom-section-${t}`}function Ie(e,t){return e?.editor_title||e?.title||t}function ze(e){return{id:`floor-${e.floor_id||"none"}`,type:"floor",floor_id:e.floor_id,title:e.name}}function Fe(e,t=0){if(!e||"object"!=typeof e)return 0;if(Array.isArray(e))return e.reduce((e,a)=>e+Fe(a,t),0);const a=e;return(t>0&&"grid"===a.type&&"number"==typeof a.columns?1:0)+Object.values(a).reduce((e,a)=>e+Fe(a,t+1),0)}const He="dashboard-strategy-editor-expanded-panels";function Ye(e){try{window.localStorage.setItem(He,JSON.stringify([...e]))}catch{}}function Te(e,t,a){const i=e._expandedPanels.has(t.key);return $.qy`
    <div class="section panel${i?"":" collapsed"}" data-panel-key=${t.key}>
      <button
        type="button"
        class="panel-header"
        aria-expanded=${i?"true":"false"}
        @click=${()=>function(e,t){e._expandedPanels.has(t)?e._expandedPanels.delete(t):e._expandedPanels.add(t),Ye(e._expandedPanels),e.requestUpdate()}(e,t.key)}
      >
        <ha-icon class="panel-icon" icon=${t.icon}></ha-icon>
        <span class="panel-title">${t.label}</span>
        <ha-icon class="panel-chevron" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${i?$.qy`<div class="panel-body">${a()}</div>`:$.s6}
    </div>
  `}class Me extends $.WF{constructor(){super(...arguments),this._hass=null,this._isUpdatingConfig=!1,this._config={},this._expandedAreas=new Set,this._expandedGroups=new Map,this._expandedWeatherBlocks=new Set,this._entityListState={search:{},draggedId:null},this._expandedPanels=function(){try{const e=window.localStorage.getItem(He);if(!e)return new Set;const t=JSON.parse(e);if(Array.isArray(t))return new Set(t.filter(e=>"string"==typeof e))}catch{}return new Set}(),this._diagnosticsChecked=!1,this._optionSearch="",this._showChangedOnly=!1,this._diagnostics=new M,this._openingMeasured=!1,this._areaEntitiesCache=new Map,this._entitySelectOptionsCache=null,this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null,this._sortedAreasCache=null,this._refDashboards=null,this._refDashboardsLoading=!1,this._cardPickerOpen=!1,this._cardPickerStep="type",this._cardPickerSearch="",this._cardPickerSelectedType="",this._cardPickerYaml="",this._cardPickerHasVisualEditor=!1,this._cardPickerCallback=null,this._cardPickerConfig=null,this._openCardPickerForWeatherStartCard=()=>{this._openCardPicker(e=>{const t=this._createWeatherStartItemId("card"),a=s().dump(e).trim(),i=[...this._config.custom_cards||[],{id:t,editor_title:"",yaml:a,parsed_config:e}],o=[...this._getWeatherStartLayoutItems(),{id:`custom-card-${t}`,type:"custom_card",custom_card_id:t}],r={...this._config,custom_cards:i,weather_start_layout_items:o};this._config=r,this._fireConfigChanged(r),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-card-${t}`])})},this._weatherStartDragSort=qe({itemSelector:".section-order-item",keyOf:e=>e.dataset.wsId,clearScope:()=>this.shadowRoot?.querySelector("#weather-start-order-list"),onReorder:(e,t)=>{const a=We(this._getWeatherStartLayoutItems(),e=>e.id,e,t);a&&this._saveWeatherStartLayoutItems(a)}}),this._handleWeatherStartDragStart=this._weatherStartDragSort.onDragStart,this._handleWeatherStartDragEnd=this._weatherStartDragSort.onDragEnd,this._handleWeatherStartDragOver=this._weatherStartDragSort.onDragOver,this._handleWeatherStartDragLeave=this._weatherStartDragSort.onDragLeave,this._handleWeatherStartDrop=this._weatherStartDragSort.onDrop,this._stackDragSort=qe({itemSelector:".section-order-item",keyOf:e=>e.dataset.stackKey,clearScope:()=>this.shadowRoot,onReorder:(e,t,a)=>{const i=a.dataset.areaId;if(!i)return;const o=We(this._getStacksOrder(i),e=>e,e,t);o&&this._updateStacksOrder(i,o)}}),this._handleStackDragStart=this._stackDragSort.onDragStart,this._handleStackDragEnd=this._stackDragSort.onDragEnd,this._handleStackDragOver=this._stackDragSort.onDragOver,this._handleStackDragLeave=this._stackDragSort.onDragLeave,this._handleStackDrop=this._stackDragSort.onDrop,this._addCustomRefView=()=>{const e=[...this._config.custom_views||[]];e.push({title:"",path:"",icon:"",ref_dashboard:"",ref_view:""});const t={...this._config,custom_views:e};this._config=t,this._fireConfigChanged(t),this._loadRefDashboards()},this._areaDragSort=qe({itemSelector:".area-item",keyOf:e=>e.dataset.areaId,clearScope:()=>this.shadowRoot?.querySelector("#area-list"),onReorder:(e,t)=>{const a=We(this._getAreaOrder(),e=>e,e,t);a&&this._updateAreaOrder(a)}}),this._handleDragStart=this._areaDragSort.onDragStart,this._handleDragEnd=this._areaDragSort.onDragEnd,this._handleDragOver=this._areaDragSort.onDragOver,this._handleDragLeave=this._areaDragSort.onDragLeave,this._handleDrop=this._areaDragSort.onDrop,this._openCardPickerForCustomCard=()=>{this._openCardPicker(e=>{const t=s().dump(e).trim(),a=[...this._config.custom_cards||[]];a.push({editor_title:"",yaml:t,parsed_config:e});const i={...this._config,custom_cards:a};this._config=i,this._fireConfigChanged(i)})},this._handlePickerOverlayClick=e=>{e.target===e.currentTarget&&this._closeCardPicker()},this._weatherLayoutHost=this.createWeatherLayoutHost(),this._optionPanelHost=this.createOptionPanelHost(),this._roomOptionsHost=this.createRoomOptionsHost(),this._customViewsHost=this.createCustomViewsHost(),this._customContentHost=this.createCustomContentHost(),this._cardPickerHost=this.createCardPickerHost()}connectedCallback(){super.connectedCallback(),(0,V.sX)("editor-open"),this._openingMeasured=!1,this._unsubscribeLanguage=(0,A.P)(()=>this.requestUpdate()),r().catch(()=>{})}disconnectedCallback(){this._unsubscribeLanguage?.(),this._unsubscribeLanguage=void 0,super.disconnectedCallback()}set hass(e){const t=this._hass;if(this._hass=e,t&&t.language===e.language&&t.locale===e.locale||(0,A.rI)(e),!t||t.entities===e.entities&&t.devices===e.devices&&t.language===e.language&&t.locale===e.locale||(this._entitySelectOptionsCache=null),!t||t.areas===e.areas&&t.floors===e.floors||(this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null,this._sortedAreasCache=null),t&&(0,L.Gp)(t,e)){this._areaEntitiesCache.clear();for(const e of this._expandedAreas)this._loadAreaEntities(e)}const a=this.shadowRoot?.querySelector(".card-editor-visual-host");a?.firstElementChild&&(a.firstElementChild.hass=e),((0,L.Gp)(t??void 0,e)||this._expandedPanels.has("diagnostics"))&&this.requestUpdate()}setConfig(e){this._isUpdatingConfig||(e=(0,U.l)(e),this._config.areas_display?.hidden===e.areas_display?.hidden&&this._config.areas_display?.order===e.areas_display?.order&&this._config.areas_display?.nav_items===e.areas_display?.nav_items||this._invalidateWeatherStartOptionsCaches(),this._config=e,this._entitySelectOptionsCache=null)}_invalidateWeatherStartOptionsCaches(){this._weatherStartAreaOptionsCache=null,this._weatherStartFloorOptionsCache=null}_getAllEntitiesForSelect(){if(!this._hass)return[];if(this._entitySelectOptionsCache&&this._entitySelectOptionsCache.config===this._config&&this._entitySelectOptionsCache.entities===this._hass.entities&&this._entitySelectOptionsCache.devices===this._hass.devices&&!function(e,t){if(e===t)return!1;const a=Object.keys(t);return a.length!==Object.keys(e).length||a.some(a=>!e[a]||e[a].attributes.friendly_name!==t[a].attributes.friendly_name)}(this._entitySelectOptionsCache.states,this._hass.states))return this._entitySelectOptionsCache.states=this._hass.states,this._entitySelectOptionsCache.options;const e=this._hass.entities||{},t=Object.values(this._hass.devices||{}),a=new Map(t.map(e=>[e.id,e])),i=new Map;t.forEach(e=>{const t=(0,N.i)(e,e=>a.get(e));t&&i.set(e.id,t)});const o=this._hass,r=new Set(this._diagnostics.analyze(this._config).references.map(e=>e.entityId)),s=[...new Set([...Object.keys(o.states),...r])].filter(e=>function(e,t,a){return!j(e,t)||a.has(t)}(o,e,r)).map(t=>{const a=o.states[t],r=e[t];let s=r?.area_id;return!s&&r?.device_id&&(s=i.get(r.device_id)??null),{entity_id:t,name:(a?.attributes?.friendly_name||t.split(".")[1].replace(/_/g," "))+(j(o,t)?` (${(0,A.kg)("editor.entity_existing_restricted")})`:""),area_id:s,device_area_id:s}}).sort((e,t)=>e.name.localeCompare(t.name));return this._entitySelectOptionsCache={config:this._config,entities:this._hass.entities,devices:this._hass.devices,states:this._hass.states,options:s},s}_getSortedAreas(){if(!this._hass)return[];if(this._sortedAreasCache?.areas===this._hass.areas)return this._sortedAreasCache.options;const e=Object.values(this._hass.areas).sort((e,t)=>e.name.localeCompare(t.name));return this._sortedAreasCache={areas:this._hass.areas,options:e},e}_getNormalizedAreasDisplay(e=this._config){return this._hass?(0,G.KA)(Object.values(this._hass.areas),e.areas_display):e.areas_display}_getFilteredEntities(e,t=!1){if(!this._hass||e.length<2)return[];const a=e.toLowerCase(),i=this._getAllEntitiesForSelect().filter(e=>!(t&&!e.area_id&&!e.device_area_id)&&(e.name.toLowerCase().includes(a)||e.entity_id.toLowerCase().includes(a)));return i.sort((e,t)=>{const i=e.name.toLowerCase(),o=t.name.toLowerCase(),r=e.entity_id.toLowerCase(),s=t.entity_id.toLowerCase(),n=i===a||r===a;if(n!==(o===a||s===a))return n?-1:1;const d=i.startsWith(a)||r.startsWith(a)||r.split(".")[1]?.startsWith(a);return d!==(o.startsWith(a)||s.startsWith(a)||s.split(".")[1]?.startsWith(a))?d?-1:1:i.localeCompare(o)}),i.slice(0,21)}render(){if(!this._hass)return $.s6;const e=this._optionPanelHost;return $.qy`
      <div class="card-config">
        ${this._renderPanelNavigation()} ${this._renderOptionSearch()}
        ${Te(this,{key:"diagnostics",icon:"mdi:clipboard-check-outline",label:(0,A.kg)("editor.diagnostics_title")},()=>this._renderDiagnostics())}
        ${Te(this,X("overview"),()=>function(e){const t=e.config,a=t.overview_area_card_columns??"full",i=(0,W.EB)(t)?"compact_hourly":"full",o=E("overview_max_columns");return $.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_overview")}</div>
      ${function(e){const t=e._config.theme||"",a=e._config.background||{},i=a.image,o="number"==typeof a.opacity?a.opacity:100,r=Object.keys(e._hass?.themes.themes||{}).sort((e,t)=>e.localeCompare(t));return $.qy`
    <div class="form-row">
      <label style="margin-right: 8px; min-width: 120px;">${(0,A.kg)("editor.theme")}</label>
      <select
        style="flex: 1;"
        @change=${t=>function(e,t){const a={...e._config};t?a.theme=t:delete a.theme,e._fireConfigChanged(a)}(e,t.target.value.trim())}
      >
        <option value="" ?selected=${!t}>${(0,A.kg)("editor.theme_default")}</option>
        ${r.map(e=>$.qy`<option value=${e} ?selected=${e===t}>${e}</option>`)}
      </select>
    </div>
    <div class="form-row" style="display: block;">
      ${customElements.get("ha-form")?$.qy`<ha-form
              .hass=${e._hass}
              .data=${{image:i}}
              .schema=${ge}
              .computeLabel=${()=>(0,A.kg)("editor.background_image")}
              @value-changed=${t=>ve(e,t.detail.value.image)}
            ></ha-form>`:$.qy`<label>${(0,A.kg)("editor.background_image")}</label>
              <input
                type="text"
                .value=${"string"==typeof i?i:""}
                placeholder="/local/background.jpg"
                @change=${t=>ve(e,t.target.value.trim())}
              />`}
      <div class="description">${(0,A.kg)("editor.background_image_desc")}</div>
    </div>
    ${i?$.qy`<div class="form-row">
              <label style="margin-right: 8px; min-width: 120px;">${(0,A.kg)("editor.background_opacity")}</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                style="flex: 1;"
                .value=${String(o)}
                @change=${t=>ye(e,"opacity",Number(t.target.value))}
              />
              <span>${o}%</span>
            </div>
            ${e._renderCheckbox("dashboard-background-fixed",(0,A.kg)("editor.background_fixed"),"fixed"===a.attachment,t=>ye(e,"attachment",t?"fixed":void 0))}`:$.s6}
  `}(e.editor)}
      ${ke(e,"weather_entity","basic-weather-entity",(0,A.kg)("editor.weather_entity_auto"),we(e.hass,e=>e.startsWith("weather.")))}
      ${fe("overview-max-columns",(0,A.kg)("editor.overview_max_columns"),String(t.overview_max_columns??3),(o?.values??[1,2,3,4]).map(e=>({value:String(e),label:String(e)})),t=>e.setOption("overview_max_columns",Number(t),3))}
      ${fe("overview-area-card-columns",(0,A.kg)("editor.overview_area_card_columns"),String(a),[{value:"full",label:(0,A.kg)("editor.columns_full")},{value:"6",label:"2"},{value:"4",label:"3"}],t=>e.setOption("overview_area_card_columns","full"===t?"full":Number(t),"full"))}
      ${fe("weather-start-weather-mode",(0,A.kg)("editor.weather_start_weather_mode"),(0,W.As)(t),[{value:"full",label:(0,A.kg)("editor.weather_mode_full")},{value:"compact_hourly",label:(0,A.kg)("editor.weather_mode_compact_hourly")}],t=>e.setOption("weather_start_weather_mode",t,i))}
      ${fe("weather-start-date-card",(0,A.kg)("editor.weather_start_date_card"),t.weather_start_date_card??"button-card",[{value:"button-card",label:"button-card"},{value:"markdown",label:(0,A.kg)("editor.date_card_markdown")}],t=>e.setOption("weather_start_date_card",t,"button-card"))}
    </div>
  `}(e))}
        ${Te(this,X("summaries"),()=>function(e){const t={description:!1};return $.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_summaries")}</div>
      ${se(e,"show_light_summary",{...t,defaultOn:!0,id:"basic-show-light-summary"})}
      ${se(e,"show_covers_summary",{...t,defaultOn:!0,id:"basic-show-covers-summary"})}
      ${se(e,"show_security_summary",{...t,defaultOn:!0,id:"basic-show-security-summary"})}
      ${se(e,"show_climate_summary",{...t,id:"basic-show-climate-summary"})}
      ${se(e,"show_battery_summary",{...t,defaultOn:!0,id:"basic-show-battery-summary"})}
      ${se(e,"show_windows_summary")} ${se(e,"compact_overview_summaries")}
    </div>
  `}(e))}
        ${Te(this,X("overviewSections"),()=>function(e){const t=new Set(e.config.hidden_section_headings||[]);return $.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_overview_sections")}</div>
      <div class="description description-intro">${(0,A.kg)("editor.overview_sections_desc")}</div>
      ${me.OH.filter(e=>e.toggle).map(t=>{const{flag:a,defaultOn:i}=t.toggle;return $.qy`
          <div class="form-row">
            <input
              type="checkbox"
              id=${a.replace(/_/g,"-")}
              ?checked=${re(e.config,a,i)}
              @change=${t=>e.toggle(a,t.target.checked,i)}
            />
            <label for=${a.replace(/_/g,"-")}>
              <ha-icon class="row-icon" icon=${t.icon}></ha-icon>${(0,A.kg)(t.labelKey)}
            </label>
          </div>
        `})}
      <div class="description description-intro">${(0,A.kg)("editor.overview_sections_hint")}</div>

      ${!0===e.config.show_agenda_section?xe(e,"agenda_calendar_entities","calendar."):$.s6}
      ${!0===e.config.show_todos_section?xe(e,"todos_entities","todo."):$.s6}

      <div class="subsection-title">${(0,A.kg)("editor.hidden_section_headings")}</div>
      <div class="description description-intro">${(0,A.kg)("editor.hidden_section_headings_desc")}</div>
      ${be.map(a=>e.checkbox(`hide-heading-${a.replace(/_/g,"-")}`,(0,A.kg)(`sections.${a}`),t.has(a),t=>e.update(e=>{const i=new Set(e.hidden_section_headings||[]);t?i.add(a):i.delete(a),i.size>0?e.hidden_section_headings=[...i]:delete e.hidden_section_headings})))}
    </div>
  `}(e))}
        ${Te(this,X("favorites"),()=>function(e){const t=e.config.light_favorite_entities||[];return $.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_favorites")}</div>
      ${pe(e,{key:"favorite_entities",listId:"favorites-list",emptyLabel:(0,A.kg)("editor.no_favorites")})}
      <div class="description">${(0,A.kg)("editor.favorites_desc")}</div>
      ${se(e,"favorites_show_state",{labelKey:"editor.show_state",description:!1})}
      ${se(e,"favorites_hide_last_changed",{labelKey:"editor.hide_last_changed",description:!1})}

      <div class="subsection-title">${(0,A.kg)("editor.light_favorites")}</div>
      <ha-textfield
        .value=${t.join(", ")}
        label=${(0,A.kg)("editor.light_favorites_entities")}
        helper=${(0,A.kg)("editor.light_favorites_desc")}
        @change=${t=>{const a=ne(t.target.value,e=>e.startsWith("light."));e.update(e=>{a.length>0?e.light_favorite_entities=a:delete e.light_favorite_entities})}}
      ></ha-textfield>

      <div class="subsection-title">${(0,A.kg)("editor.quick_actions")}</div>
      ${pe(e,{key:"quick_action_entities",listId:"quick-actions-list",emptyLabel:(0,A.kg)("editor.no_quick_actions")})}
      <div class="description">${(0,A.kg)("editor.quick_actions_desc")}</div>
    </div>
  `}(e))}

        <div class="section-divider">
          <div class="section-divider-title">${(0,A.kg)("editor.section_areas_rooms")}</div>
        </div>

        ${Te(this,X("areas"),()=>this._renderAreasListSection())}
        ${Te(this,X("areaOptions"),()=>this._renderAreasSection())}
        ${Te(this,X("roomPins"),()=>{return t=e,$.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_room_pins")}</div>
      ${pe(t,{key:"room_pin_entities",listId:"room-pins-list",emptyLabel:(0,A.kg)("editor.no_room_pins"),withArea:!0})}
      <div class="description">${(0,ce._)((0,A.kg)("editor.room_pins_desc"))}</div>
      ${se(t,"room_pins_show_state",{labelKey:"editor.show_state",description:!1})}
      ${se(t,"room_pins_hide_last_changed",{labelKey:"editor.hide_last_changed",description:!1})}
    </div>
  `;var t})}
        ${Te(this,X("views"),()=>this._renderViewsSection())}

        <div class="section-divider">
          <div class="section-divider-title">${(0,A.kg)("editor.section_advanced")}</div>
        </div>
        ${Te(this,X("appearance"),()=>function(e){const t=e.config,a=!0===t.show_search_card,i="tip"===t.search_card_variant,o=i||void 0!==customElements.get("search-card")&&void 0!==customElements.get("card-tools");return $.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_overview_details")}</div>

      <div class="subsection-title">${(0,A.kg)("editor.header_badges")}</div>
      ${se(e,"show_person_badges",{defaultOn:!0})}
      ${fe("person-badge-layout",(0,A.kg)("editor.person_badge_layout"),t.person_badge_layout||"with_state",["minimal","with_state","with_state_and_time"].map(e=>({value:e,label:(0,A.kg)(`editor.person_badge_layout_${e}`)})),t=>e.update(e=>{"with_state"===t?delete e.person_badge_layout:e.person_badge_layout=t}))}
      <div class="description">${(0,A.kg)("editor.person_badge_layout_desc")}</div>
      ${se(e,"show_unavailable_alert_badge")} ${se(e,"show_now_playing_badge")}
      ${se(e,"show_sun_badge")} ${se(e,"show_updates_badge")}
      ${ke(e,"power_badge_entity","power-badge-entity",(0,A.kg)("editor.power_badge_none"),we(e.hass,t=>t.startsWith("sensor.")&&"power"===e.hass?.states[t]?.attributes?.device_class&&!e.hass?.entities[t]?.entity_category))}
      <div class="description">${(0,A.kg)("editor.power_badge_entity_desc")}</div>

      <div class="subsection-title">${(0,A.kg)("editor.overview_blocks")}</div>
      ${se(e,"show_clock_card",{defaultOn:!0})}
      ${ke(e,"alarm_entity","alarm-entity",(0,A.kg)("editor.alarm_none"),we(e.hass,e=>e.startsWith("alarm_control_panel.")))}
      <div class="description">${(0,A.kg)("editor.alarm_desc")}</div>
      ${ke(e,"house_mode_entity","house-mode-entity",(0,A.kg)("editor.house_mode_none"),(r=e.hass,we(r,e=>{if(!e.startsWith("input_select.")&&!e.startsWith("select."))return!1;const t=r?.entities[e]?.entity_category;return"config"!==t&&"diagnostic"!==t})))}
      <div class="description">${(0,A.kg)("editor.house_mode_desc")}</div>

      ${se(e,"show_search_card",{description:!1,disabled:!o})}
      <div class="description">
        ${o?(0,A.kg)("editor.show_search_card_desc"):$.qy`<span>&#x26A0;&#xFE0F; ${(0,ce._)((0,A.kg)("editor.show_search_card_missing"))}</span>`}
      </div>
      ${a?fe("search-card-variant",(0,A.kg)("editor.search_card_variant"),i?"tip":"custom",[{value:"custom",label:(0,A.kg)("editor.search_card_variant_custom")},{value:"tip",label:(0,A.kg)("editor.search_card_variant_tip")}],t=>e.update(e=>{"tip"===t?e.search_card_variant="tip":delete e.search_card_variant})):$.s6}
    </div>
  `;var r}(e))}
        ${Te(this,X("details"),()=>function(e){const t=e.config,a=t.summaries_columns||2,i="critical"===t.unavailable_batteries_bucket?"critical":"good",o=t.security_extra_entities||[],r=(t,a)=>t?$.s6:se(e,a);return $.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_summary_details")}</div>

      ${$e("summaries-2-columns","summaries-columns",(0,A.kg)("editor.columns_2"),2===a,()=>Se(e,"summaries_columns",void 0))}
      ${$e("summaries-4-columns","summaries-columns",(0,A.kg)("editor.columns_4"),4===a,()=>Se(e,"summaries_columns",4))}
      <div class="description">${(0,A.kg)("editor.columns_desc")}</div>

      <div class="subsection-title">${(0,A.kg)("editor.security_options")}</div>
      ${r(!1!==t.show_security_summary,"show_security_view")}
      ${se(e,"group_security_by_areas")} ${se(e,"hide_hidden_areas_in_security")}
      ${se(e,"show_security_activity")}
      <div class="form-row">
        <label for="security-activity-position">${(0,A.kg)("editor.security_activity_position")}</label>
        <select
          id="security-activity-position"
          @change=${t=>Se(e,"security_activity_position","end"===t.target.value?"end":void 0)}
        >
          <option value="start" ?selected=${"end"!==t.security_activity_position}>
            ${(0,A.kg)("editor.position_start")}
          </option>
          <option value="end" ?selected=${"end"===t.security_activity_position}>
            ${(0,A.kg)("editor.position_end")}
          </option>
        </select>
      </div>
      <ha-textfield
        .value=${o.join(", ")}
        label=${(0,A.kg)("editor.security_extra_entities")}
        @change=${t=>{const a=ne(t.target.value,e=>e.includes("."));Se(e,"security_extra_entities",a.length>0?a:void 0)}}
      ></ha-textfield>

      <div class="subsection-title">${(0,A.kg)("editor.lights_options")}</div>
      ${r(!1!==t.show_light_summary,"show_light_view")} ${se(e,"group_lights_by_floors")}
      ${se(e,"group_lights_by_areas")} ${se(e,"nested_light_groups")}
      ${e.checkbox("lights-sort-by-name",(0,A.kg)("editor.lights_sort_by_name"),"name"===t.lights_sort_by,t=>Se(e,"lights_sort_by",t?"name":void 0))}
      <div class="description">${(0,A.kg)("editor.lights_sort_by_name_desc")}</div>

      <div class="subsection-title">${(0,A.kg)("editor.covers_options")}</div>
      ${r(!1!==t.show_covers_summary,"show_covers_view")}
      ${se(e,"group_covers_by_floors")} ${se(e,"group_covers_by_areas")}
      ${se(e,"show_partially_open_covers")}

      <div class="subsection-title">${(0,A.kg)("editor.climate_options")}</div>
      ${!0===t.show_climate_summary?$.s6:se(e,"show_climate_view")}
      ${se(e,"show_climate_air_quality")}
      ${!0===t.show_climate_air_quality?$.qy`
              ${Ce(e,"climate_humidity_threshold",{id:"climate-humidity-threshold",label:(0,A.kg)("editor.climate_humidity_threshold"),defaultValue:65,min:1,max:100,unit:"%"})}
              ${Ce(e,"climate_co2_threshold",{id:"climate-co2-threshold",label:(0,A.kg)("editor.climate_co2_threshold"),defaultValue:1200,min:400,max:5e3,unit:"ppm"})}
            `:$.s6}

      <div class="subsection-title">${(0,A.kg)("editor.battery_options")}</div>
      ${se(e,"hide_mobile_app_batteries")} ${se(e,"hide_battery_notes_entities")}
      ${!1!==t.show_battery_summary?$.s6:se(e,"show_battery_view")}
      ${se(e,"show_area_in_battery_view")} ${se(e,"group_batteries_by_areas")}

      <div class="option-group-title">${(0,A.kg)("editor.battery_thresholds")}</div>
      ${Ce(e,"battery_critical_threshold",{id:"battery-critical-threshold",label:(0,A.kg)("editor.battery_critical_below"),defaultValue:D("battery_critical_threshold",t),min:1,max:99,unit:"%"})}
      ${Ce(e,"battery_low_threshold",{id:"battery-low-threshold",label:(0,A.kg)("editor.battery_low_below"),defaultValue:D("battery_low_threshold",t),min:1,max:99,unit:"%"})}
      <div class="description">${(0,A.kg)("editor.battery_thresholds_desc")}</div>

      <div class="option-group-title">${(0,A.kg)("editor.unavailable_batteries_bucket")}</div>
      ${$e("battery-unavailable-good","battery-unavailable-bucket",(0,A.kg)("batteries.good"),"good"===i,()=>Se(e,"unavailable_batteries_bucket",void 0))}
      ${$e("battery-unavailable-critical","battery-unavailable-bucket",(0,A.kg)("batteries.critical"),"critical"===i,()=>Se(e,"unavailable_batteries_bucket","critical"))}
      <div class="description">${(0,A.kg)("editor.unavailable_batteries_bucket_desc")}</div>
    </div>
  `}(e))}
        ${Te(this,X("sectionOrder"),()=>this._renderWeatherStartOrderPanel())}
        ${Te(this,X("advanced"),()=>{return t=e,$.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_advanced_options")}</div>
      ${se(t,"hide_unavailable_entities")} ${se(t,"dense_section_placement")}
      ${se(t,"hide_completed_todos")}
    </div>
  `;var t})}
        ${Te(this,X("customContent"),()=>this._renderCustomContentSection())}
      </div>
      ${this._cardPickerOpen?this._renderCardPickerOverlay():$.s6}
    `}_renderPanelNavigation(){return $.qy`<nav class="panel-navigation" aria-label=${(0,A.kg)("editor.panel_navigation")}>
      <label for="panel-navigation-select">${(0,A.kg)("editor.panel_navigation")}</label>
      <select
        id="panel-navigation-select"
        @change=${e=>{const t=e.target,a=t.value;t.value="",a&&this._jumpToPanel(a)}}
      >
        <option value="">${(0,A.kg)("editor.panel_navigation")}</option>
        ${J.map(e=>$.qy`<optgroup label=${(0,A.kg)(e.labelKey)}>
              ${e.panels.map(e=>$.qy`<option value=${e}>${X(e).label}</option>`)}
            </optgroup>`)}
      </select>
    </nav>`}_renderOptionSearch(){const e=this._optionSearch.trim(),t=""!==e||this._showChangedOnly,a=t?function(e,t,a){const i=te(t).split(/\s+/).filter(Boolean);if(!i.length&&!a)return[];const o=[];for(const t of function(e){const t=[];for(const[a,i]of Object.entries(q)){const o=Q[a];t.push({key:a,label:ae(i.labelKey),description:ae(`${i.labelKey}_desc`),panel:o,panelLabel:o?X(o).label:"",changed:ie(e,a)})}for(const{key:a,labelKey:i,panel:o}of ee)t.push({key:a,label:ae(i),description:"",panel:o,panelLabel:X(o).label,changed:ie(e,a)});return t}(e)){if(a&&!t.changed)continue;const e=te(t.label),r=te(t.key),s=te(`${t.description} ${t.panelLabel}`);i.every(t=>e.includes(t)||r.includes(t)||s.includes(t))&&o.push({entry:t,score:i.reduce((t,a)=>t+(e.includes(a)?2:r.includes(a)?1:0),0)})}return o.sort((e,t)=>t.score-e.score||e.entry.label.localeCompare(t.entry.label)).map(({entry:e})=>e)}(this._config,e,this._showChangedOnly):[];return $.qy`<section class="option-search" aria-label=${(0,A.kg)("editor.search_options")}>
      <input
        type="search"
        class="option-search-input"
        .value=${this._optionSearch}
        placeholder=${(0,A.kg)("editor.search_options_placeholder")}
        aria-label=${(0,A.kg)("editor.search_options")}
        @input=${e=>{this._optionSearch=e.target.value}}
      />
      ${this._renderCheckbox("option-search-changed",(0,A.kg)("editor.show_changed_only"),this._showChangedOnly,e=>{this._showChangedOnly=e})}
      <div role="status" aria-live="polite">
        ${t&&!a.length?$.qy`<p class="description">${(0,A.kg)(e?"editor.no_results":"editor.no_changed_options")}</p>`:$.s6}
      </div>
      ${a.length?$.qy`<ul class="option-search-results">
              ${a.map(e=>$.qy`<li>
                    <button
                      type="button"
                      class="option-search-result"
                      ?disabled=${!e.panel}
                      @click=${()=>{e.panel&&this._jumpToPanel(e.panel)}}
                    >
                      <span>${e.label}</span>
                      <span class="option-search-meta"
                        >${e.panelLabel||(0,A.kg)("editor.search_yaml_only")} · <code>${e.key}</code></span
                      >
                    </button>
                  </li>`)}
            </ul>`:$.s6}
    </section>`}async _jumpToPanel(e){const t=X(e);!function(e,t){e._expandedPanels.has(t)||(e._expandedPanels.add(t),Ye(e._expandedPanels),e.requestUpdate())}(this,t.key),await this.updateComplete;const a=this.shadowRoot?.querySelector(`[data-panel-key="${t.key}"] .panel-header`);a?.scrollIntoView({block:"start",behavior:"smooth"}),a?.focus({preventScroll:!0})}async _openDiagnosticLocation(e){const t=X(e.startsWith("areas_")?"areaOptions":e.startsWith("room_pin")?"roomPins":e.startsWith("weather_start")?"sectionOrder":e.startsWith("custom_")?"customContent":e.includes("favorite")||e.startsWith("quick_action")?"favorites":"overview");this._expandedPanels.add(t.key);const a=e.startsWith("areas_options.")?e.split(".")[1]:void 0;a&&(this._expandedAreas=new Set([...this._expandedAreas,a]),this._areaEntitiesCache.has(a)||this._loadAreaEntities(a)),this.requestUpdate(),await this.updateComplete;const i=[...this.shadowRoot?.querySelectorAll(".panel-header")??[]].find(e=>e.textContent?.includes(t.label)),o=a?[...this.shadowRoot?.querySelectorAll(".area-item")??[]].find(e=>e.dataset.areaId===a):void 0;(o??i)?.scrollIntoView({block:"start",behavior:"smooth"}),a&&e.includes("view_override")&&o?.querySelector("textarea")?.focus()}_renderDiagnostics(){const e=this._diagnosticsChecked&&this._hass?this._diagnostics.inspect(this._config,this._hass):[];return $.qy`
      <p>${(0,A.kg)("editor.diagnostics_help")}</p>
      <button
        type="button"
        @click=${()=>n(()=>{this._diagnosticsChecked=!0,this.requestUpdate()})}
      >
        ${(0,A.kg)("editor.diagnostics_check")}
      </button>
      <div role="status" aria-live="polite">
        ${this._diagnosticsChecked&&!e.length?$.qy`<p>${(0,A.kg)("editor.diagnostics_ok")}</p>`:$.s6}
      </div>
      ${["error","warning","info"].map(t=>$.qy` ${e.some(e=>e.severity===t)?$.qy`<h3>${(0,A.kg)("editor.diagnostics_severity_"+t)}</h3>`:$.s6}
          ${e.filter(e=>e.severity===t).map(e=>$.qy`<div class="custom-item" style="overflow-wrap:anywhere">
                  <strong>${(0,A.kg)("editor.diagnostics_"+(e.status??e.code))}</strong>${e.entityId?$.qy`: ${e.entityId}`:$.s6}
                  <div>${e.path}</div>
                  <button type="button" @click=${()=>{this._openDiagnosticLocation(e.path)}}>
                    ${(0,A.kg)("editor.diagnostics_open")}
                  </button>
                </div>`)}`)}
    `}_createWeatherStartItemId(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}_getWeatherStartAreaOptions(){if(!this._hass)return[];const e=this._getNormalizedAreasDisplay(),t=e?.hidden||[],a=e?.order||[],i=t.join("\0"),o=a.join("\0");if(this._weatherStartAreaOptionsCache&&this._weatherStartAreaOptionsCache.areas===this._hass.areas&&this._weatherStartAreaOptionsCache.hiddenKey===i&&this._weatherStartAreaOptionsCache.orderKey===o)return this._weatherStartAreaOptionsCache.options;const r=function(e,t,a){const i=new Set(t),o=new Map(a.map((e,t)=>[e,t]));return Object.values(e||{}).filter(e=>!i.has(e.area_id)).sort((e,t)=>{const a=o.get(e.area_id)??-1,i=o.get(t.area_id)??-1;return(a>=0?a:9999)-(i>=0?i:9999)||e.name.localeCompare(t.name)})}(this._hass.areas,t,a);return this._weatherStartAreaOptionsCache={areas:this._hass.areas,hiddenKey:i,orderKey:o,options:r},r}_getWeatherStartFloorOptions(){if(!this._hass)return[];const e=this._getWeatherStartAreaOptions();if(this._weatherStartFloorOptionsCache&&this._weatherStartFloorOptionsCache.floors===this._hass.floors&&this._weatherStartFloorOptionsCache.areas===e)return this._weatherStartFloorOptionsCache.options;const t=function(e,t){const a=new Set;let i=!1;for(const e of t)e.floor_id?a.add(e.floor_id):i=!0;const o=Object.values(e||{}).filter(e=>a.has(e.floor_id)).sort((e,t)=>(e.level??9999)-(t.level??9999)||e.name.localeCompare(t.name)).map(e=>({floor_id:e.floor_id,name:e.name,icon:e.icon}));return i&&o.push({floor_id:null,name:(0,A.kg)("sections.areas_other"),icon:"mdi:home-outline"}),o}(this._hass.floors,e);return this._weatherStartFloorOptionsCache={floors:this._hass.floors,areas:e,options:t},t}_getCustomCardRef(e,t){return Ve(e,t)}_getCustomSectionRef(e,t){return Ke(e,t)}_getCustomCardEditorLabel(e,t){return Ie(e,t)}_normalizeWeatherStartLayoutItems(e){return function(e,t,a,i){const o=new Set(a.map(e=>e.area_id)),r=new Set,s=[],n=(e,t)=>{o.has(e)&&!r.has(e)&&(r.add(e),s.push({...t||{},id:t?.id||`area-${e}`,type:"area",area_id:e}))},d=e=>{const t=a.filter(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id);if(0!==t.length){for(const e of t)r.add(e.area_id);s.push({...e})}};for(const o of e)if("area"!==o.type)if("floor"!==o.type)if("areas"!==o.type)s.push({...o});else if(!0===t.group_by_floors)for(const e of i)d(ze(e));else for(const e of a)n(e.area_id);else d(o);else o.area_id&&n(o.area_id,o);for(const e of a)n(e.area_id);return s}(e,this._config,this._getWeatherStartAreaOptions(),this._getWeatherStartFloorOptions())}_getWeatherStartLayoutItems(){const e=this._config.weather_start_layout_items?.length?this._config.weather_start_layout_items.map(e=>({...e})):function(e,t,a){const i=[];for(const o of function(e){return e.weather_start_order||[...B.l]}(e)){const r=e.weather_start_blocks_config?.[o];if("areas"===o)if(!0===e.group_by_floors)for(const e of a)i.push(ze(e));else for(const e of t)i.push({id:`area-${e.area_id}`,type:"area",area_id:e.area_id});else"custom_cards"===o?(e.custom_cards||[]).forEach((e,t)=>{const a=Ve(e,t);i.push({id:`custom-card-${a}`,type:"custom_card",custom_card_id:a})}):"custom_sections"===o?(e.custom_sections||[]).forEach((e,t)=>{const a=Ke(e,t);i.push({id:`custom-section-${a}`,type:"custom_section",custom_section_id:a})}):i.push({id:o,type:o,...r?.yaml?{yaml:r.yaml,parsed_config:r.parsed_config,_yaml_error:r._yaml_error}:{}})}return i}(this._config,this._getWeatherStartAreaOptions(),this._getWeatherStartFloorOptions());return this._normalizeWeatherStartLayoutItems((0,W.wX)(e,this._config))}_saveWeatherStartLayoutItems(e){return function(e,t){const a=e._normalizeWeatherStartLayoutItems(t),i={...e._config,weather_start_layout_items:a};e._config=i,e._fireConfigChanged(i)}(this._weatherLayoutHost,e)}_toggleWeatherBlockExpanded(e){const t=new Set(this._expandedWeatherBlocks);t.has(e)?t.delete(e):t.add(e),this._expandedWeatherBlocks=t}_parseWeatherStartItemYaml(e){return function(e,t){const a=t.trim();if(!a)return{parsed_config:void 0,_yaml_error:void 0};try{const e=s().load(a);return Array.isArray(e)||e&&"object"==typeof e?{parsed_config:e}:{parsed_config:void 0,_yaml_error:"YAML must be a card, section, view with sections, or list of cards"}}catch(e){return{parsed_config:void 0,_yaml_error:(e instanceof Error?e.message.split("\n")[0]:"Invalid YAML")||"Invalid YAML"}}}(this._weatherLayoutHost,e)}_updateWeatherStartItemYaml(e,t){return function(e,t,a){n(()=>{const i=e._getWeatherStartLayoutItems().map(i=>{if(i.id!==t)return i;const o={...i,yaml:a},r=e._parseWeatherStartItemYaml(a);return o.parsed_config=r.parsed_config,o._yaml_error=r._yaml_error,a.trim()||(delete o.yaml,delete o.parsed_config,delete o._yaml_error),o});if(i.find(e=>e.id===t&&e._yaml_error))return e._config={...e._config,weather_start_layout_items:i},void e.requestUpdate();e._saveWeatherStartLayoutItems(i)})}(this._weatherLayoutHost,e,t)}_resetWeatherStartItemYaml(e){return function(e,t){const a=e._getWeatherStartLayoutItems().map(e=>{if(e.id!==t)return e;const a={...e};return delete a.yaml,delete a.parsed_config,delete a._yaml_error,a});e._saveWeatherStartLayoutItems(a)}(this._weatherLayoutHost,e)}_getWeatherStartCustomCardIndex(e,t=this._config.custom_cards||[]){return"custom_card"!==e.type?-1:t.findIndex((t,a)=>this._getCustomCardRef(t,a)===e.custom_card_id)}_getWeatherStartCustomSectionIndex(e,t=this._config.custom_sections||[]){return"custom_section"!==e.type?-1:t.findIndex((t,a)=>this._getCustomSectionRef(t,a)===e.custom_section_id)}_renderWeatherStartCustomCardEditor(e,t){return function(e,t,a){const i=t._yaml_error?$.qy`<div style="color: var(--error-color); font-size: 12px; margin-top: 4px;">&#x274C; ${t._yaml_error}</div>`:t.yaml?$.qy`<div style="color: var(--success-color, green); font-size: 12px; margin-top: 4px;">
          &#x2705; ${(0,A.kg)("editor.yaml_valid")}
        </div>`:$.s6;return $.qy`
    <label class="form-row" style="margin: 0 0 8px 0;">
      <span style="min-width: 150px;">${(0,A.kg)("editor.card_editor_title_label")}</span>
      <input
        type="text"
        style="flex: 1;"
        .value=${t.editor_title||""}
        placeholder=${(0,A.kg)("editor.card_editor_title_placeholder")}
        @change=${t=>e._updateCustomCardField(a,"editor_title",t.target.value)}
      />
    </label>
    <div class="description" style="margin: 0 0 8px 0;">${(0,A.kg)("editor.card_editor_title_help")}</div>
    <label class="form-row" style="margin: 0 0 8px 0;">
      <span style="min-width: 150px;">${(0,A.kg)("editor.card_dashboard_title_label")}</span>
      <input
        type="text"
        style="flex: 1;"
        .value=${t.title||""}
        placeholder=${(0,A.kg)("editor.card_title_placeholder")}
        @change=${t=>e._updateCustomCardField(a,"title",t.target.value)}
      />
    </label>
    <div class="description" style="margin: 0 0 6px 0;">${(0,A.kg)("editor.weather_start_card_yaml_desc")}</div>
    <textarea
      rows="8"
      style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
      placeholder=${(0,A.kg)("editor.yaml_placeholder")}
      .value=${t.yaml||""}
      @change=${t=>e._updateCustomCardYaml(a,t.target.value)}
    ></textarea>
    <button class="btn-primary" style="margin-top: 6px;" @click=${()=>e._openCardEditorForCustomCard(a)}>
      ${(0,A.kg)("editor.edit_card_with_ha_editor")}
    </button>
    ${i}
  `}(this._weatherLayoutHost,e,t)}_renderWeatherStartCustomSectionEditor(e,t){return function(e,t,a){const i=t.cards||[];return $.qy`
    <div class="custom-item-row" style="margin-bottom: 8px;">
      <input
        type="text"
        .value=${t.title||""}
        placeholder=${(0,A.kg)("editor.custom_section_title_placeholder")}
        style="flex: 2;"
        @change=${t=>e._updateCustomSectionField(a,"title",t.target.value)}
      />
      <input
        type="text"
        .value=${t.icon||""}
        placeholder=${(0,A.kg)("editor.custom_section_icon_placeholder")}
        style="flex: 1;"
        @change=${t=>e._updateCustomSectionField(a,"icon",t.target.value)}
      />
    </div>
    <div class="description" style="margin: 0 0 8px 0;">${(0,A.kg)("editor.weather_start_section_cards_desc")}</div>
    ${0===i.length?$.qy`<div class="empty-state">${(0,A.kg)("editor.no_custom_cards")}</div>`:i.map((t,i)=>{const o=t._yaml_error?$.qy`<span style="color: var(--error-color);">&#x274C; ${t._yaml_error}</span>`:t.yaml?$.qy`<span style="color: var(--success-color, green);"
                    >&#x2705; ${(0,A.kg)("editor.yaml_valid")}</span
                  >`:$.s6;return $.qy`
              <div class="custom-item" style="margin-bottom: 8px;">
                <div class="custom-item-header">
                  <strong
                    >${e._getCustomCardEditorLabel(t,`${(0,A.kg)("editor.new_card")} ${i+1}`)}</strong
                  >
                  <button class="btn-remove" @click=${()=>e._removeCardFromSection(a,i)}>
                    &#x2715;
                  </button>
                </div>
                <div class="custom-item-fields">
                  <label>${(0,A.kg)("editor.card_editor_title_label")}</label>
                  <input
                    type="text"
                    .value=${t.editor_title||""}
                    placeholder=${(0,A.kg)("editor.card_editor_title_placeholder")}
                    @change=${t=>e._updateSectionCardField(a,i,"editor_title",t.target.value)}
                  />
                  <div class="description" style="margin: 0 0 4px 0;">${(0,A.kg)("editor.card_editor_title_help")}</div>
                  <label>${(0,A.kg)("editor.card_dashboard_title_label")}</label>
                  <input
                    type="text"
                    .value=${t.title||""}
                    placeholder=${(0,A.kg)("editor.card_title_placeholder")}
                    @change=${t=>e._updateSectionCardField(a,i,"title",t.target.value)}
                  />
                  <textarea
                    rows="5"
                    placeholder=${(0,A.kg)("editor.yaml_placeholder")}
                    .value=${t.yaml||""}
                    style="width: 100%;"
                    @change=${t=>e._updateSectionCardYaml(a,i,t.target.value)}
                  ></textarea>
                  <button
                    class="btn-primary"
                    style="margin-top: 6px;"
                    @click=${()=>e._openCardEditorForSectionCard(a,i)}
                  >
                    ${(0,A.kg)("editor.edit_card_with_ha_editor")}
                  </button>
                  <div class="custom-item-validation">${o}</div>
                </div>
              </div>
            `})}
    <button class="btn-primary" style="margin-top: 4px;" @click=${()=>e._openCardPickerForSection(a)}>
      ${(0,A.kg)("editor.add_card_to_section")}
    </button>
  `}(this._weatherLayoutHost,e,t)}_removeWeatherStartItem(e){const t=this._getWeatherStartLayoutItems(),a=t.find(t=>t.id===e),i=t.filter(t=>t.id!==e);if(a){if("custom_card"===a.type){const e=[...this._config.custom_cards||[]],t=this._getWeatherStartCustomCardIndex(a,e);t>=0&&e.splice(t,1);const o={...this._config,weather_start_layout_items:i};return e.length>0?o.custom_cards=e:delete o.custom_cards,this._config=o,void this._fireConfigChanged(o)}if("custom_section"===a.type){const e=[...this._config.custom_sections||[]],t=this._getWeatherStartCustomSectionIndex(a,e);t>=0&&e.splice(t,1);const o={...this._config,weather_start_layout_items:i};return e.length>0?o.custom_sections=e:delete o.custom_sections,this._config=o,void this._fireConfigChanged(o)}this._saveWeatherStartLayoutItems(i)}else this._saveWeatherStartLayoutItems(i)}_addWeatherStartSummaries(){const e=this._getWeatherStartLayoutItems();e.some(e=>"summaries"===e.type)||(e.push({id:this._createWeatherStartItemId("summaries"),type:"summaries",summary_size:"mini"}),this._saveWeatherStartLayoutItems(e),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,e[e.length-1].id]))}_addWeatherStartArea(e){const t=e.target.value;if(!t)return;const a=this._getWeatherStartLayoutItems();a.push({id:this._createWeatherStartItemId(`area-${t}`),type:"area",area_id:t}),this._saveWeatherStartLayoutItems(a),e.target.value=""}_addWeatherStartFloor(e){const t=e.target.value;if(!t)return;const a="__none__"===t?null:t,i=this._getWeatherStartFloorOptions().find(e=>e.floor_id===a),o=this._getWeatherStartLayoutItems();o.push({id:this._createWeatherStartItemId(`floor-${a||"none"}`),type:"floor",floor_id:a,title:i?.name}),this._saveWeatherStartLayoutItems(o),e.target.value=""}_toggleWeatherStartItemStack(e,t){const a=this._getWeatherStartLayoutItems().map(a=>{if(a.id!==e)return a;const i={...a};return t?i.stack_with_previous=!0:delete i.stack_with_previous,i});this._saveWeatherStartLayoutItems(a)}_weatherStartTitleChanged(e,t){const a=t.trim(),i=this._getWeatherStartLayoutItems().map(t=>{if(t.id!==e)return t;const i={...t};return a?i.title=a:delete i.title,i});this._saveWeatherStartLayoutItems(i)}_weatherStartSummarySizeChanged(e,t){const a=this._getWeatherStartLayoutItems().map(a=>a.id!==e?a:{...a,summary_size:t});this._saveWeatherStartLayoutItems(a)}_addWeatherStartSection(){const e=this._createWeatherStartItemId("section"),t=[...this._config.custom_sections||[],{id:e,title:"",icon:"",cards:[]}],a=[...this._getWeatherStartLayoutItems(),{id:`custom-section-${e}`,type:"custom_section",custom_section_id:e}],i={...this._config,custom_sections:t,weather_start_layout_items:a};this._config=i,this._fireConfigChanged(i),this._expandedWeatherBlocks=new Set([...this._expandedWeatherBlocks,`custom-section-${e}`])}_getWeatherStartItemMeta(e,t,a,i){return function(e,t,a,i,o){if("area"===e.type){const a=t.find(t=>t.area_id===e.area_id);return{icon:a?.icon||"mdi:home-outline",label:a?.name||e.area_id||(0,A.kg)("sections.areas")}}if("floor"===e.type){const t=a.find(t=>t.floor_id===(e.floor_id??null));return{icon:t?.icon||"mdi:floor-plan",label:e.title||t?.name||(0,A.kg)("sections.areas")}}if("custom_card"===e.type)return{icon:"mdi:cards",label:Ie(i.find((t,a)=>Ve(t,a)===e.custom_card_id),(0,A.kg)("editor.new_card"))};if("custom_section"===e.type){const t=o.find((t,a)=>Ke(t,a)===e.custom_section_id);return{icon:t?.icon||"mdi:view-grid-plus-outline",label:t?.title||(0,A.kg)("editor.section_custom_sections")}}const r=Ee.get(e.type);return{icon:r?.icon||"mdi:view-dashboard-outline",label:r?(0,A.kg)(r.labelKey):e.type}}(e,t,this._getWeatherStartFloorOptions(),a,i)}_isWeatherStartItemDisabled(e,t,a){return function(e,t,a,i,o){return!e.parsed_config&&(!!e._yaml_error||("custom_card"===e.type?!i.some((t,a)=>Ve(t,a)===e.custom_card_id&&t.parsed_config):"custom_section"===e.type?!o.some((t,a)=>Ke(t,a)===e.custom_section_id&&(t.cards||[]).some(e=>e.parsed_config)):"floor"===e.type?!a.some(t=>e.floor_id?t.floor_id===e.floor_id:!t.floor_id):!!Ee.has(e.type)&&function(e,t){switch(t){case"clock":return!1===e.show_clock_card;case"weather_current":case"weather_daily":return!1===e.show_weather;case"weather_hourly":return!1===e.show_weather||"compact_hourly"===(0,W.As)(e);case"weather_details":return 0===(e.weather_sensors||[]).length&&0===(e.pollen_entities||[]).length;case"favorites":return 0===(e.favorite_entities||[]).length;case"light_favorites":return 0===(e.light_favorite_entities||[]).length;case"alarm":return!e.alarm_entity;case"search":return!0!==e.show_search_card;case"overview":return!(e.custom_cards||[]).some(e=>"overview"===(e.target_section||"custom_cards"));case"energy":return!1===e.show_energy;case"plants":return!0!==e.show_plants_section;case"agenda":return!0!==e.show_agenda_section;case"todos":return!0!==e.show_todos_section;case"persons":return!0!==e.show_persons_section;case"vacuums":return!0!==e.show_vacuums_section;case"maintenance":return!0!==e.show_maintenance_section;case"quick_actions":return 0===(e.quick_action_entities||[]).length;case"media":return!0!==e.show_media_section;case"timers":return!0!==e.show_timers_section;case"activity":return!0!==e.show_activity_section;case"custom_cards":return 0===(e.custom_cards||[]).length;case"custom_sections":return 0===(e.custom_sections||[]).length;case"summaries":return!1===e.show_light_summary&&!1===e.show_covers_summary&&!1===e.show_security_summary&&!1===e.show_battery_summary&&!0!==e.show_climate_summary&&!0!==e.show_windows_summary;default:return!1}}(t,e.type)))}(e,this._config,this._getWeatherStartAreaOptions(),t,a)}_countNestedFixedGrids(e,t=0){return Fe(e,t)}_renderWeatherStartOrderPanel(){return function(e){const t=e._getWeatherStartLayoutItems(),a=e._getWeatherStartAreaOptions(),i=e._getWeatherStartFloorOptions(),o=e._config.custom_cards||[],r=e._config.custom_sections||[],s=t.some(e=>"summaries"===e.type),n=new Set(t.filter(e=>"area"===e.type&&e.area_id).map(e=>e.area_id));for(const e of t)if("floor"===e.type)for(const t of a)(e.floor_id?t.floor_id!==e.floor_id:t.floor_id)||n.add(t.area_id);const d=a.filter(e=>!n.has(e.area_id));let c=0;const l=t.some(e=>(c=e.stack_with_previous?c+1:0,c>=2)),_=t.map(t=>{const i=e._getWeatherStartItemMeta(t,a,o,r),s=e._getWeatherStartCustomCardIndex(t,o),n=e._getWeatherStartCustomSectionIndex(t,r);return{item:t,...i,disabled:e._isWeatherStartItemDisabled(t,o,r),expanded:e._expandedWeatherBlocks.has(t.id),customCard:s>=0?o[s]:void 0,customCardIndex:s,customSection:n>=0?r[n]:void 0,customSectionIndex:n,fixedGridCount:e._countNestedFixedGrids(t.parsed_config)}});return h={items:_,areas:a,floors:i,unplacedAreas:d,hasSummariesBlock:s,hasLongStackChain:l,renderCustomCardEditor:(t,a)=>e._renderWeatherStartCustomCardEditor(t,a),renderCustomSectionEditor:(t,a)=>e._renderWeatherStartCustomSectionEditor(t,a),onDragStart:e._handleWeatherStartDragStart,onDragEnd:e._handleWeatherStartDragEnd,onDragOver:e._handleWeatherStartDragOver,onDragLeave:e._handleWeatherStartDragLeave,onDrop:e._handleWeatherStartDrop,onToggleExpanded:t=>e._toggleWeatherBlockExpanded(t),onRemove:t=>e._removeWeatherStartItem(t),onSummarySizeChanged:(t,a)=>e._weatherStartSummarySizeChanged(t,a),onStackChanged:(t,a)=>e._toggleWeatherStartItemStack(t,a),onTitleChanged:(t,a)=>e._weatherStartTitleChanged(t,a),onYamlChanged:(t,a)=>e._updateWeatherStartItemYaml(t,a),onResetYaml:t=>e._resetWeatherStartItemYaml(t),onAddCard:e._openCardPickerForWeatherStartCard,onAddSummaries:()=>e._addWeatherStartSummaries(),onAddSection:()=>e._addWeatherStartSection(),onAddArea:t=>e._addWeatherStartArea(t),onAddFloor:t=>e._addWeatherStartFloor(t)},$.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.weather_start_order")}</div>
      <div class="description" style="margin-left: 0; margin-bottom: 12px;">
        ${(0,A.kg)("editor.weather_start_order_desc")}
      </div>
      ${h.hasLongStackChain?$.qy`
              <div style="color:var(--warning-color,#f0a000);font-size:12px;margin:0 0 10px 0;">
                ${(0,A.kg)("editor.weather_start_stack_warning")}
              </div>
            `:$.s6}
      <div class="section-order-list" id="weather-start-order-list">
        ${h.items.map(({item:e,icon:t,label:a,disabled:i,expanded:o,customCard:r,customCardIndex:s,customSection:n,customSectionIndex:d,fixedGridCount:c})=>{const l=!!e.yaml,_="area"!==e.type&&"floor"!==e.type;return $.qy`
              <div>
                <div
                  class="section-order-item ${i?"disabled":""}"
                  data-ws-id=${e.id}
                  draggable="true"
                  @dragstart=${h.onDragStart}
                  @dragend=${h.onDragEnd}
                  @dragover=${h.onDragOver}
                  @dragleave=${h.onDragLeave}
                  @drop=${h.onDrop}
                >
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${t}></ha-icon>
                  <span class="section-label">${a}</span>
                  ${i?$.qy`<span class="section-hidden-tag">(${(0,A.kg)("editor.section_hidden")})</span>`:$.s6}
                  ${l?$.qy`<span
                          class="section-hidden-tag"
                          style="background:var(--primary-color);color:#fff;margin-left:4px;"
                          >✎</span
                        >`:$.s6}
                  <button
                    class="icon-btn"
                    style="margin-left:auto;"
                    title=${(0,A.kg)("editor.weather_start_block_expand")}
                    @click=${t=>{t.stopPropagation(),h.onToggleExpanded(e.id)}}
                  >
                    <ha-icon icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                  </button>
                  ${_?$.qy`<button
                          class="icon-btn"
                          title=${(0,A.kg)("editor.remove")}
                          @click=${t=>{t.stopPropagation(),h.onRemove(e.id)}}
                        >
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>`:$.s6}
                </div>
                ${o?$.qy`
                        <div
                          style="padding: 8px 12px 12px 12px; background: var(--secondary-background-color); border-radius: 0 0 8px 8px; margin-bottom: 4px;"
                        >
                          ${r?h.renderCustomCardEditor(r,s):$.s6}
                          ${n?h.renderCustomSectionEditor(n,d):$.s6}
                          ${r||n||"summaries"!==e.type?$.s6:$.qy`
                                  <label class="form-row" style="margin: 0 0 8px 0;">
                                    <span style="min-width: 120px;"
                                      >${(0,A.kg)("editor.weather_start_summary_size")}</span
                                    >
                                    <select
                                      style="flex:1;"
                                      .value=${e.summary_size||"mini"}
                                      @change=${t=>h.onSummarySizeChanged(e.id,t.target.value)}
                                    >
                                      <option value="mini">
                                        ${(0,A.kg)("editor.weather_start_summary_size_mini")}
                                      </option>
                                      <option value="normal">
                                        ${(0,A.kg)("editor.weather_start_summary_size_normal")}
                                      </option>
                                    </select>
                                  </label>
                                `}
                          ${r||n||!(0,O.w)(e.type)?$.s6:$.qy`
                                  <label class="form-row" style="margin: 0 0 8px 0;">
                                    <span style="min-width: 120px;"
                                      >${(0,A.kg)("editor.weather_start_block_title")}</span
                                    >
                                    <input
                                      type="text"
                                      style="flex:1;"
                                      .value=${e.title||""}
                                      placeholder=${(0,A.kg)("editor.weather_start_block_title_placeholder")}
                                      @change=${t=>h.onTitleChanged(e.id,t.target.value)}
                                    />
                                  </label>
                                `}
                          ${r||n?$.s6:$.qy`
                                  <label class="form-row" style="margin: 0 0 8px 0;">
                                    <input
                                      type="checkbox"
                                      ?checked=${!0===e.stack_with_previous}
                                      @change=${t=>h.onStackChanged(e.id,t.target.checked)}
                                    />
                                    <span>${(0,A.kg)("editor.weather_start_stack_with_previous")}</span>
                                  </label>
                                  <div class="description" style="margin: 0 0 6px 0;">
                                    ${(0,A.kg)("editor.weather_start_block_yaml_desc")}
                                  </div>
                                  <textarea
                                    rows="6"
                                    style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
                                    placeholder=${(0,A.kg)("editor.yaml_placeholder")}
                                    .value=${e.yaml||""}
                                    @change=${t=>h.onYamlChanged(e.id,t.target.value)}
                                  ></textarea>
                                  ${e._yaml_error?$.qy`<div style="color:var(--error-color);font-size:12px;margin-top:4px;">
                                          ${e._yaml_error}
                                        </div>`:$.s6}
                                  ${c>0?$.qy`<div
                                          style="color:var(--warning-color,#f0a000);font-size:12px;margin-top:4px;"
                                        >
                                          ${(0,A.kg)("editor.weather_start_responsive_warning").replace("{count}",String(c))}
                                        </div>`:$.s6}
                                  ${e.parsed_config?$.qy`<div
                                          style="color:var(--success-color,green);font-size:12px;margin-top:4px;"
                                        >
                                          ${(0,A.kg)("editor.yaml_valid")}
                                        </div>`:$.s6}
                                  ${l?$.qy`<button
                                          class="text-btn"
                                          style="margin-top:8px;"
                                          @click=${()=>h.onResetYaml(e.id)}
                                        >
                                          ${(0,A.kg)("editor.weather_start_block_reset")}
                                        </button>`:$.s6}
                                `}
                        </div>
                      `:$.s6}
              </div>
            `})}
      </div>
      <div class="description" style="margin: 12px 0 6px 0;">${(0,A.kg)("editor.weather_start_add_content_desc")}</div>
      <div class="custom-item-row weather-start-add-row">
        <button class="btn-primary" @click=${h.onAddCard}>${(0,A.kg)("editor.weather_start_add_card")}</button>
        ${h.hasSummariesBlock?$.s6:$.qy`<button class="btn-primary" @click=${h.onAddSummaries}>
                ${(0,A.kg)("editor.weather_start_add_summaries")}
              </button>`}
        <button class="btn-primary" @click=${h.onAddSection}>
          ${(0,A.kg)("editor.weather_start_add_section")}
        </button>
        <select @change=${h.onAddArea}>
          <option value="">${(0,A.kg)("editor.weather_start_add_area")}</option>
          ${h.unplacedAreas.map(e=>$.qy`<option value=${e.area_id}>${e.name}</option>`)}
        </select>
        <select @change=${h.onAddFloor}>
          <option value="">${(0,A.kg)("editor.weather_start_add_floor")}</option>
          ${h.floors.map(e=>$.qy`<option value=${e.floor_id||"__none__"}>${e.name}</option>`)}
        </select>
      </div>
    </div>
  `;var h}(this._weatherLayoutHost)}_getStacksOrder(e){return(0,G.WZ)(this._config.areas_options?.[e]?.stacks_order)}_updateStacksOrder(e,t){const a=t.join("|")===B.x.join("|");this._applyConfig(m(this._config,e,e=>(a?delete e.stacks_order:e.stacks_order=t,e)))}_renderStackOrderPanel(e,t){return function(e){const{areaId:t,order:a,visible:i}=e,o=a.filter(e=>i.has(e)),r=a.filter(e=>!i.has(e));return $.qy`
    <div class="entity-group" data-group="stack_order">
      <div class="entity-group-header">
        <ha-icon icon="mdi:sort"></ha-icon>
        <span class="group-name">${(0,A.kg)("editor.stack_order")}</span>
      </div>
      <div class="entity-list">
        <div class="description" style="margin-left: 0; margin-bottom: 8px;">
          ${(0,A.kg)("editor.stack_order_desc")}
        </div>
        <div class="section-order-list" data-area-id=${t}>
          ${o.map((a,i)=>{const r=Ae.get(a);return r?$.qy`
              <div
                class="section-order-item"
                data-area-id=${t}
                data-stack-key=${a}
                draggable="true"
                @dragstart=${e.onDragStart}
                @dragend=${e.onDragEnd}
                @dragover=${e.onDragOver}
                @dragleave=${e.onDragLeave}
                @drop=${e.onDrop}
              >
                <span class="drag-handle" draggable="true">&#x2630;</span>
                <ha-icon class="section-icon" icon=${r.icon}></ha-icon>
                <span class="section-label">${(0,A.kg)(r.labelKey)}</span>
                <button
                  type="button"
                  class="stack-move-button"
                  aria-label=${`${(0,A.kg)(r.labelKey)}: ${(0,A.kg)("editor.move_up")}`}
                  title=${(0,A.kg)("editor.move_up")}
                  ?disabled=${0===i}
                  @click=${()=>e.onMove(a,-1)}
                >
                  <ha-icon icon="mdi:chevron-up"></ha-icon>
                </button>
                <button
                  type="button"
                  class="stack-move-button"
                  aria-label=${`${(0,A.kg)(r.labelKey)}: ${(0,A.kg)("editor.move_down")}`}
                  title=${(0,A.kg)("editor.move_down")}
                  ?disabled=${i===o.length-1}
                  @click=${()=>e.onMove(a,1)}
                >
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>
              </div>
            `:$.s6})}
        </div>
        ${r.length>0?$.qy`<div class="section-order-compact">
                <div class="compact-title">${(0,A.kg)("editor.stack_order_inactive")}</div>
                <div class="compact-chip-list">
                  ${r.map(e=>{const t=Ae.get(e);return t?$.qy`<span class="compact-chip"
                          ><ha-icon icon=${t.icon}></ha-icon>${(0,A.kg)(t.labelKey)}</span
                        >`:$.s6})}
                </div>
              </div>`:$.s6}
      </div>
    </div>
  `}({areaId:e,order:this._getStacksOrder(e),visible:Oe(t.groupedEntities,this._config),onMove:(a,i)=>{const o=this._getStacksOrder(e),r=function(e,t,a,i){const o=e.filter(e=>t.has(e)),r=o.indexOf(a),s=o[r+i];if(r<0||!s)return e;const n=[...e],d=n.indexOf(a),c=n.indexOf(s);return[n[d],n[c]]=[n[c],n[d]],n}(o,Oe(t.groupedEntities,this._config),a,i);r!==o&&this._updateStacksOrder(e,r)},onDragStart:this._handleStackDragStart,onDragEnd:this._handleStackDragEnd,onDragOver:this._handleStackDragOver,onDragLeave:this._handleStackDragLeave,onDrop:this._handleStackDrop})}_renderAreasListSection(){const e=this._getSortedAreas(),t=this._getNormalizedAreasDisplay(),a=t?.hidden||[],i=t?.order||[],o=t?.nav_items||[];return $.qy`
      <div class="section">
        <div class="section-title">${(0,A.kg)("editor.section_area_views")}</div>
        <div class="description" style="margin-left: 0;">${(0,A.kg)("editor.area_view_override_intro")}</div>
        <div class="description" style="margin-left: 0;">${(0,A.kg)("editor.area_entity_settings_desc")}</div>
        <div class="area-list" id="area-list">${this._renderAreaItems(e,a,i,o)}</div>
      </div>
    `}_renderAreasSection(){return function(e,t){const a=e.config.area_display_type??"compact";return $.qy`
    <div class="section">
      <div class="section-title">${(0,A.kg)("editor.section_areas")}</div>

      <div class="option-groups">
        <div class="option-group">
          <div class="option-group-title">
            <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
            <span>${(0,A.kg)("editor.area_overview_options")}</span>
          </div>
          ${se(e,"group_by_floors")}

          <div class="form-row">
            <label for="area-display-type">${(0,A.kg)("editor.area_display_type")}</label>
            <select
              id="area-display-type"
              .value=${a}
              @change=${e=>t(e.target.value)}
            >
              <option value="compact">${(0,A.kg)("editor.area_display_type_compact")}</option>
              <option value="picture">${(0,A.kg)("editor.area_display_type_picture")}</option>
            </select>
          </div>
          <div class="description">${(0,A.kg)("editor.area_display_type_desc")}</div>

          ${se(e,"show_switches_on_areas")} ${se(e,"show_alerts_on_areas")}
        </div>

        <div class="option-group">
          <div class="option-group-title">
            <ha-icon icon="mdi:door-open"></ha-icon>
            <span>${(0,A.kg)("editor.room_view_options")}</span>
          </div>
          ${se(e,"show_locks_in_rooms")} ${se(e,"show_automations_in_rooms")}
          ${se(e,"show_scripts_in_rooms")} ${se(e,"show_vacuums_section_in_rooms")}
          ${se(e,"show_switches_section_in_rooms")} ${se(e,"show_helpers_section_in_rooms")}
          ${se(e,"show_sensors_section_in_rooms")} ${se(e,"show_cover_controls_in_rooms")}
          ${se(e,"show_cameras_in_rooms",{defaultOn:!0})} ${se(e,"camera_live_toggle")}
          ${se(e,"camera_pause_when_hidden")} ${se(e,"show_energy_in_rooms",{defaultOn:!0})}
          ${se(e,"show_ups_in_rooms",{defaultOn:!0})}
          ${se(e,"hide_grouped_climate_members",{defaultOn:!0})}
          ${se(e,"show_window_contacts_in_rooms")} ${se(e,"show_door_contacts_in_rooms")}
        </div>

        <div class="option-group">
          <div class="option-group-title">
            <ha-icon icon="mdi:sort-alphabetical-ascending"></ha-icon>
            <span>${(0,A.kg)("editor.area_management_options")}</span>
          </div>
          ${se(e,"use_default_area_sort")}
        </div>
      </div>
    </div>
  `}(this._optionPanelHost,e=>this._globalAreaDisplayTypeChanged(e))}_renderViewsSection(){const e=!0===this._config.show_summary_views,t=!0===this._config.show_room_views,a=!0===this._config.show_cctv_view,i=!0===this._config.cctv_show_activity,o=this._config.show_camera_events??i,r=!0===this._config.show_cameras_in_security,s=!1!==this._config.show_maintenance_view,n=!1!==this._config.show_maintenance_activity,d=!1!==this._config.show_video_tips,c=!0===this._config.show_energy_view;return $.qy`${function(e){const t=(t,a,i,o=!1)=>$.qy`
    ${e.checkbox(t,(0,A.kg)(`editor.${a}`),i,t=>e.change(a,t,o))}
    <div class="description">${(0,A.kg)(`editor.${a}_desc`)}</div>
  `;return $.qy`<div class="section">
    <div class="section-title">${(0,A.kg)("editor.section_views")}</div>
    ${t("show-summary-views","show_summary_views",e.showSummaryViews)}
    ${t("show-room-views","show_room_views",e.showRoomViews)}
    ${t("show-energy-view","show_energy_view",e.showEnergyView)}
    ${t("show-cctv-view","show_cctv_view",e.showCctvView)}
    ${t("cctv-show-activity","cctv_show_activity",e.cctvShowActivity)}
    ${t("show-camera-events","show_camera_events",e.showCameraEvents)}
    ${t("show-cameras-in-security","show_cameras_in_security",e.showCamerasInSecurity)}
    ${t("show-maintenance-view","show_maintenance_view",e.showMaintenanceView)}
    ${t("show-maintenance-activity","show_maintenance_activity",e.showMaintenanceActivity,!0)}
    ${t("show-video-tips","show_video_tips",e.showVideoTips,!0)}
  </div>`}({showSummaryViews:e,showRoomViews:t,showCctvView:a,cctvShowActivity:i,showCameraEvents:o,showCamerasInSecurity:r,showMaintenanceView:s,showMaintenanceActivity:n,showVideoTips:d,showEnergyView:c,checkbox:(e,t,a,i)=>this._renderCheckbox(e,t,a,i),change:(e,t,a=!1)=>{"show_camera_events"===e?this._setCctvOptions({show_camera_events:t}):"cctv_show_activity"===e&&void 0===this._config.show_camera_events?this._setCctvOptions({cctv_show_activity:t,show_camera_events:!1}):this._toggleChanged(e,t,a)}})}${l=this,l._hass?$.qy`<div class="section">
    <div class="section-title">${(0,A.kg)("editor.room_visibility")}</div>
    <div class="description" style="margin-left: 0;">${(0,A.kg)("editor.room_visibility_desc")}</div>
    ${l._getSortedAreas().map(e=>{const t=l._config.room_visibility?.[e.area_id];return $.qy`<div class="option-group">
        <div class="option-group-title">${e.name}</div>
        <div class="form-row">
          <ha-textfield
            label=${(0,A.kg)("editor.room_visibility_entity")}
            .value=${t?.entity||""}
            @change=${t=>Pe(l,e.area_id,"entity",t.target.value)}
          ></ha-textfield>
          <ha-textfield
            label=${(0,A.kg)("editor.room_visibility_state")}
            .value=${t?.state||""}
            @change=${t=>Pe(l,e.area_id,"state",t.target.value)}
          ></ha-textfield>
        </div>
      </div>`})}
  </div>`:$.qy``}${function(e){if(!e._hass)return $.qy``;const t=Object.entries(e._hass.states).filter(([e,t])=>e.startsWith("person.")&&"string"==typeof t.attributes.user_id).map(([e,t])=>({id:t.attributes.user_id,name:String(t.attributes.friendly_name||e)})).sort((e,t)=>e.name.localeCompare(t.name));if(0===t.length)return $.qy``;const a=[["home",(0,A.kg)("views.overview")],...(0,K.v4)(e._config,"lights")?[["lights",(0,A.kg)("views.lights")]]:[],...(0,K.v4)(e._config,"covers")?[["covers",(0,A.kg)("views.covers")]]:[],...(0,K.v4)(e._config,"security")?[["security",(0,A.kg)("views.security")]]:[],...(0,K.v4)(e._config,"batteries")?[["batteries",(0,A.kg)("views.batteries")]]:[],...(0,K.v4)(e._config,"climate")?[["climate",(0,A.kg)("views.climate")]]:[],...!0===e._config.show_energy_view?[["energy",(0,A.kg)("views.energy")]]:[],...!0===e._config.show_cctv_view?[["cctv",(0,A.kg)("views.cctv")]]:[],...!0===e._config.show_maintenance_view?[["maintenance",(0,A.kg)("views.maintenance")]]:[],...Object.values(e._hass.areas).map(e=>[e.area_id,e.name]),...(e._config.custom_views||[]).filter(e=>(e.parsed_config||e.ref_dashboard&&e.ref_view)&&e.path&&e.title).map(e=>[e.path,e.title])],i=me.OH.filter(t=>!(0,me.PM)(t.key,e._config)).map(e=>[e.key,(0,A.kg)(e.labelKey)]);for(const t of e._config.custom_sections||[])t.id&&i.push([t.id,t.title||t.id]);const o=(a,i)=>i.map(([i,o])=>{const r="view"===a?e._config.view_visible_users:e._config.section_visible_users,s=Object.prototype.hasOwnProperty.call(r||{},i)?r?.[i]||[]:t.map(e=>e.id);return $.qy`<div class="option-group">
        <div class="option-group-title">${o}</div>
        ${t.map(o=>e._renderCheckbox(`${a}-${i}-${o.id}`,o.name,s.includes(o.id),r=>function(e,t,a,i,o,r){const s={...("view"===t?e._config.view_visible_users:e._config.section_visible_users)||{}},n=new Set(Object.prototype.hasOwnProperty.call(s,a)?s[a]:o);r?n.add(i):n.delete(i),o.every(e=>n.has(e))&&[...n].every(e=>o.includes(e))?delete s[a]:s[a]=[...n];const d={...e._config};"view"===t?Object.keys(s).length?d.view_visible_users=s:delete d.view_visible_users:Object.keys(s).length?d.section_visible_users=s:delete d.section_visible_users,e._fireConfigChanged(d)}(e,a,i,o.id,t.map(e=>e.id),r)))}
      </div>`});return $.qy`<div class="section">
    <div class="section-title">${(0,A.kg)("editor.user_visibility")}</div>
    <div class="description" style="margin-left: 0;">${(0,A.kg)("editor.user_visibility_warning")}</div>
    <div class="description" style="margin-left: 0; color: var(--warning-color, #ffa600);">
      ${(0,A.kg)("editor.user_visibility_no_person_warning")}
    </div>
    <div class="option-group-title">${(0,A.kg)("editor.user_visibility_views")}</div>
    ${o("view",a)}
    <div class="option-group-title">${(0,A.kg)("editor.user_visibility_sections")}</div>
    ${o("section",i)}
  </div>`}(this)}`;var l}_renderCustomContentSection(){return de(this._customContentHost)}_renderCheckbox(e,t,a,i,o=!1){return $.qy`
      <div class="form-row">
        <input
          type="checkbox"
          id=${e}
          ?checked=${a}
          ?disabled=${o}
          @change=${e=>i(e.target.checked)}
        />
        <label for=${e} class=${o?"disabled-label":""}>${t}</label>
      </div>
    `}_renderAreaItems(e,t,a,i){return function(e,t,a,i,o){if(0===t.length)return $.qy`<div class="empty-state">${(0,A.kg)("editor.no_areas")}</div>`;const r=new Map(i.map((e,t)=>[e,t])),s=new Map(t.map((e,t)=>[e.area_id,t]));return[...t].sort((e,t)=>{const a=r.get(e.area_id),i=r.get(t.area_id);return(void 0!==a?a:9999+(s.get(e.area_id)??0))-(void 0!==i?i:9999+(s.get(t.area_id)??0))}).map(t=>{const i=a.includes(t.area_id),r=e._expandedAreas.has(t.area_id),s=e._areaEntitiesCache.get(t.area_id),n=o.includes(t.area_id);return $.qy`
      <div
        class="area-item"
        data-area-id=${t.area_id}
        draggable="true"
        @dragstart=${e._handleDragStart}
        @dragend=${e._handleDragEnd}
        @dragover=${e._handleDragOver}
        @dragleave=${e._handleDragLeave}
        @drop=${e._handleDrop}
      >
        <div class="area-header">
          <span class="drag-handle" draggable="true">&#x2630;</span>
          <input
            type="checkbox"
            class="area-checkbox"
            data-area-id=${t.area_id}
            ?checked=${!i}
            @change=${a=>e._areaVisibilityChanged(t.area_id,a.target.checked)}
          />
          <span class="area-name">${t.name}</span>
          ${e._config.areas_options?.[t.area_id]?.view_override?.yaml?$.qy`<button
                  type="button"
                  title=${(0,A.kg)("editor.override_active_help")}
                  @click=${()=>{e._openDiagnosticLocation(`areas_options.${t.area_id}.view_override`)}}
                >
                  ${(0,A.kg)("editor.override_active")}
                </button>`:$.s6}
          ${t.icon?$.qy`<ha-icon class="area-icon" icon=${t.icon}></ha-icon>`:$.s6}
          <button
            class="nav-pin-button ${n?"pinned":""}"
            title="${(0,A.kg)("editor.area_pin_nav")}"
            ?disabled=${i}
            @click=${a=>{a.stopPropagation(),e._areaNavPinChanged(t.area_id,!n)}}
          >
            <ha-icon icon="${n?"mdi:pin":"mdi:pin-outline"}"></ha-icon>
          </button>
          <button
            class="expand-button ${r?"expanded":""}"
            data-area-id=${t.area_id}
            @click=${a=>e._toggleAreaExpand(a,t.area_id)}
          >
            <span class="expand-icon">&#x25B6;</span>
          </button>
        </div>
        ${r?$.qy`
                <div class="area-content" data-area-id=${t.area_id}>
                  ${e._renderAreaDisplayTypeOverride(t)} ${e._renderAreaViewOverride(t.area_id)}
                  ${s?e._renderAreaEntities(t.area_id,s):$.qy`<div class="loading-placeholder">${(0,A.kg)("editor.loading_entities")}</div>`}
                </div>
              `:$.s6}
      </div>
    `})}(this._roomOptionsHost,e,t,a,i)}_globalAreaDisplayTypeChanged(e){const t=function(e,t){const a={...e};return"compact"===t?delete a.area_display_type:a.area_display_type=t,a}(this._config,e);this._config=t,this._fireConfigChanged(t)}_renderAreaDisplayTypeOverride(e){return function(e,t){const a=e._config.areas_options?.[t.area_id]?.display_type??"";return $.qy`
    <div class="form-row">
      <label for="area-display-type-${t.area_id}">${(0,A.kg)("editor.area_display_type_override")}</label>
      <select
        id="area-display-type-${t.area_id}"
        .value=${a}
        @change=${a=>e._areaDisplayTypeOverrideChanged(t.area_id,a.target.value)}
      >
        <option value="">${(0,A.kg)("editor.area_display_type_inherit")}</option>
        <option value="compact">${(0,A.kg)("editor.area_display_type_compact")}</option>
        <option value="picture">${(0,A.kg)("editor.area_display_type_picture")}</option>
      </select>
    </div>
    ${t.picture?$.s6:$.qy`<div class="description">${(0,A.kg)("editor.area_display_type_no_picture")}</div>`}
  `}(this._roomOptionsHost,e)}_areaDisplayTypeOverrideChanged(e,t){const a=function(e,t,a){const i={...Reflect.get(e.areas_options??{},t)??{}};a?i.display_type=a:delete i.display_type;const o={...e.areas_options};Reflect.set(o,t,i),0===Object.keys(i).length&&Reflect.deleteProperty(o,t);const r={...e};return 0===Object.keys(o).length?delete r.areas_options:r.areas_options=o,r}(this._config,e,t||void 0);this._config=a,this._fireConfigChanged(a)}_renderAreaViewOverride(e){return function(e,t){const a=e._config.areas_options?.[t]?.view_override,i=a?._yaml_error?$.qy`<span style="color: var(--error-color);">&#x274C; ${a._yaml_error}</span>`:a?.parsed_config?$.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,A.kg)("editor.yaml_valid")}</span>`:$.s6;return $.qy`
    <div class="custom-item" style="margin-bottom: 0;">
      <div class="custom-item-header">
        <strong>${(0,A.kg)("editor.area_view_override_title")}</strong>
        ${a?.yaml?$.qy`
                <button
                  class="btn-remove"
                  title=${(0,A.kg)("editor.area_view_override_remove")}
                  @click=${()=>e._updateAreaViewOverride(t,"")}
                >
                  &#x2715;
                </button>
              `:$.s6}
      </div>
      <div class="description" style="margin: 0 0 10px 0;">${(0,A.kg)("editor.area_view_override_help")}</div>
      <textarea
        rows="12"
        placeholder="type: sections&#10;sections:&#10;  - type: grid&#10;    cards: []"
        .value=${a?.yaml||""}
        style="width: 100%;"
        @change=${a=>e._updateAreaViewOverride(t,a.target.value)}
      >
      </textarea>
      <div class="custom-item-validation">${i}</div>
    </div>
  `}(this._roomOptionsHost,e)}_updateAreaViewOverride(e,t){return function(e,t,a){n(()=>{const i={...e._config.areas_options?.[t]||{}};if(a.trim()){const e=c(a,(0,A.kg)("editor.area_view_override_object_error")),t=e.parsed_config,o=t&&!Array.isArray(t);i.view_override={yaml:a,parsed_config:o?t:void 0,_yaml_error:o?e._yaml_error:e._yaml_error||(0,A.kg)("editor.area_view_override_object_error")}}else delete i.view_override;const o={...e._config.areas_options};0===Object.keys(i).length?delete o[t]:o[t]=i;const r={...e._config};0===Object.keys(o).length?delete r.areas_options:r.areas_options=o,e._config=r,e._fireConfigChanged(r)})}(this._roomOptionsHost,e,t)}_renderAreaEntities(e,t){return function(e,t,a){const{groupedEntities:i,hiddenEntities:o,badgeCandidates:r,additionalBadges:s,availableEntities:n,defaultShowNames:d,namesVisible:c,namesHidden:l}=a,_=e._hass,h=[{key:"ups",label:(0,A.kg)("stacks.ups"),icon:"mdi:power-plug-battery"},{key:"lights",label:(0,A.kg)("editor.domain_lights"),icon:"mdi:lightbulb"},{key:"climate",label:(0,A.kg)("editor.domain_climate"),icon:"mdi:thermostat"},{key:"covers",label:(0,A.kg)("editor.domain_covers"),icon:"mdi:window-shutter"},{key:"covers_curtain",label:(0,A.kg)("editor.domain_covers_curtain"),icon:"mdi:curtains"},{key:"covers_window",label:(0,A.kg)("editor.domain_covers_window"),icon:"mdi:window-open-variant"},{key:"media_player",label:(0,A.kg)("editor.domain_media_player"),icon:"mdi:speaker"},{key:"scenes",label:(0,A.kg)("editor.domain_scenes"),icon:"mdi:palette"},{key:"vacuum",label:(0,A.kg)("editor.domain_vacuum"),icon:"mdi:robot-vacuum"},{key:"fan",label:(0,A.kg)("editor.domain_fan"),icon:"mdi:fan"},{key:"switches",label:(0,A.kg)("editor.domain_switches"),icon:"mdi:light-switch"},{key:"locks",label:(0,A.kg)("editor.domain_locks"),icon:"mdi:lock"},{key:"energy",label:(0,A.kg)("stacks.energy"),icon:"mdi:lightning-bolt"},...!0===e._config.show_helpers_section_in_rooms?[{key:"helpers",label:(0,A.kg)("stacks.helpers"),icon:"mdi:tune-variant"}]:[],...!0===e._config.show_sensors_section_in_rooms?[{key:"binary_sensors",label:(0,A.kg)("stacks.sensors"),icon:"mdi:motion-sensor"}]:[]],u=h.some(e=>(i[e.key]?.length??0)>0),p=(r?.length??0)>0||(s?.length??0)>0,m=[],g=new Set,v=e=>{if(!e||g.has(e))return;g.add(e);const t=_.states[e],a=t?.attributes.friendly_name||e.split(".")[1]?.replace(/_/g," ")||e;m.push({entity_id:e,name:a})};for(const e of h)for(const t of i[e.key]||[])v(t);for(const e of r||[])v(e);for(const e of s||[])v(e);for(const e of n||[])v(e.entity_id);m.sort((e,t)=>e.name.localeCompare(t.name));const y=e._renderAreaCustomCardsSection(t,m);if(!u&&!p)return $.qy`
      <div class="empty-state">${(0,A.kg)("editor.no_entities_in_area")}</div>
      ${e._renderStackOrderPanel(t,a)} ${y}
    `;const b=e._expandedGroups.get(t)||new Set;return $.qy`
    <div class="entity-groups">
      ${h.map(a=>{const r=i[a.key];if(!r||0===r.length)return $.s6;const s=o[a.key]||[],n=r.every(e=>s.includes(e)),d=r.some(e=>s.includes(e))&&!n,c=b.has(a.key);return $.qy`
          <div class="entity-group" data-group=${a.key}>
            <div class="entity-group-header" @click=${()=>e._toggleGroupExpand(t,a.key)}>
              <input
                type="checkbox"
                class="group-checkbox"
                data-area-id=${t}
                data-group=${a.key}
                ?checked=${!n}
                .indeterminate=${d}
                @click=${e=>e.stopPropagation()}
                @change=${i=>{i.stopPropagation();const o=i.target.checked;e._groupVisibilityChanged(t,a.key,o,r)}}
              />
              <ha-icon icon=${a.icon}></ha-icon>
              <span class="group-name">${a.label}</span>
              <span class="entity-count">(${r.length})</span>
              <button
                class="expand-button-small ${c?"expanded":""}"
                @click=${i=>{i.stopPropagation(),e._toggleGroupExpand(t,a.key)}}
              >
                <span class="expand-icon-small">&#x25B6;</span>
              </button>
            </div>
            ${c?$.qy`
                    <div class="entity-list" data-area-id=${t} data-group=${a.key}>
                      ${r.map(i=>{const o=_.states[i],r=o?.attributes.friendly_name||i.split(".")[1].replace(/_/g," "),n=s.includes(i);return $.qy`
                          <div class="entity-item">
                            <input
                              type="checkbox"
                              class="entity-checkbox"
                              ?checked=${!n}
                              @change=${o=>e._entityVisibilityChanged(t,a.key,i,o.target.checked)}
                            />
                            <span class="entity-name">${r}</span>
                            <span class="entity-id">${i}</span>
                          </div>
                        `})}
                    </div>
                  `:$.s6}
          </div>
        `})}
      ${p?e._renderBadgeGroup(t,r,s,n,o,d,c,l,b):$.s6}
      ${e._renderStackOrderPanel(t,a)}
    </div>
    ${y}
  `}(this._roomOptionsHost,e,t)}_renderAreaCustomCardItem(e,t,a,i){return function(e,t,a,i,o){const r=a.mode||"yaml",s=a.position||"bottom",n=a._yaml_error?$.qy`<span style="color: var(--error-color);">&#x274C; ${a._yaml_error}</span>`:a.yaml?$.qy`<span style="color: var(--success-color, green);">&#x2705; ${(0,A.kg)("editor.yaml_valid")}</span>`:$.s6;return $.qy`
    <div class="custom-item" data-index=${i}>
      <div class="custom-item-header">
        <strong>${e._getCustomCardEditorLabel(a,(0,A.kg)("editor.area_custom_card_new"))}</strong>
        <button class="btn-remove" @click=${()=>e._removeAreaCustomCard(t,i)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <label>${(0,A.kg)("editor.card_editor_title_label")}</label>
        <input
          type="text"
          .value=${a.editor_title||""}
          placeholder=${(0,A.kg)("editor.card_editor_title_placeholder")}
          @change=${a=>e._updateAreaCustomCardField(t,i,"editor_title",a.target.value)}
        />
        <div class="description" style="margin: 0 0 4px 0;">${(0,A.kg)("editor.card_editor_title_help")}</div>
        <label>${(0,A.kg)("editor.card_dashboard_title_label")}</label>
        <input
          type="text"
          .value=${a.title||""}
          placeholder=${(0,A.kg)("editor.card_title_placeholder")}
          @change=${a=>e._updateAreaCustomCardField(t,i,"title",a.target.value)}
        />
        <div class="custom-card-target">
          <label>${(0,A.kg)("editor.area_custom_card_position")}:</label>
          <select
            @change=${a=>e._updateAreaCustomCardField(t,i,"position",a.target.value)}
          >
            <option value="top" ?selected=${"top"===s}>
              ${(0,A.kg)("editor.area_custom_card_position_top")}
            </option>
            <option value="bottom" ?selected=${"bottom"===s}>
              ${(0,A.kg)("editor.area_custom_card_position_bottom")}
            </option>
          </select>
        </div>
        <div class="custom-card-target">
          <label>${(0,A.kg)("editor.area_custom_card_mode")}:</label>
          <select
            @change=${a=>e._updateAreaCustomCardField(t,i,"mode",a.target.value)}
          >
            <option value="yaml" ?selected=${"yaml"===r}>${(0,A.kg)("editor.area_custom_card_mode_yaml")}</option>
            <option value="tile" ?selected=${"tile"===r}>${(0,A.kg)("editor.area_custom_card_mode_tile")}</option>
            <option value="section" ?selected=${"section"===r}>
              ${(0,A.kg)("editor.area_custom_card_mode_section")}
            </option>
          </select>
        </div>
        ${"tile"===r?$.qy`
                <div class="custom-card-target">
                  <label>${(0,A.kg)("editor.area_custom_card_entity")}:</label>
                  <select
                    @change=${a=>e._updateAreaCustomCardField(t,i,"entity",a.target.value)}
                  >
                    <option value="">${(0,A.kg)("editor.area_custom_card_entity_select")}</option>
                    ${o.map(e=>$.qy`
                        <option value=${e.entity_id} ?selected=${a.entity===e.entity_id}>
                          ${e.name} (${e.entity_id})
                        </option>
                      `)}
                  </select>
                </div>
              `:$.qy`
                <textarea
                  rows="6"
                  placeholder=${(0,A.kg)("editor.yaml_placeholder")}
                  .value=${a.yaml||""}
                  style="width: 100%;"
                  @change=${a=>e._updateAreaCustomCardYaml(t,i,a.target.value)}
                ></textarea>
                <button
                  class="btn-primary"
                  style="margin-top: 6px;"
                  @click=${()=>e._openCardEditorForAreaCustomCard(t,i)}
                >
                  ${(0,A.kg)("editor.edit_card_with_ha_editor")}
                </button>
                <div class="custom-item-validation">${n}</div>
              `}
      </div>
    </div>
  `}(this._roomOptionsHost,e,t,a,i)}_renderAreaCustomCardsSection(e,t){return function(e,t,a){const i=e._getAreaCustomCards(t);return $.qy`
    <div class="area-custom-cards">
      <div class="area-custom-cards-header">
        <ha-icon icon="mdi:card-plus-outline"></ha-icon>
        <span class="group-name">${(0,A.kg)("editor.area_custom_cards_title")}</span>
      </div>
      <div class="area-custom-cards-help">${(0,A.kg)("editor.area_custom_cards_help")}</div>
      ${0===i.length?$.s6:i.map((i,o)=>e._renderAreaCustomCardItem(t,i,o,a))}
      <div class="area-custom-card-actions">
        <button class="btn-primary" @click=${()=>e._addAreaCustomCard(t)}>
          ${(0,A.kg)("editor.area_custom_card_add_yaml")}
        </button>
        <button class="btn-primary" @click=${()=>e._openCardPickerForAreaCustomCard(t)}>
          ${(0,A.kg)("editor.area_custom_card_add_picker")}
        </button>
      </div>
    </div>
  `}(this._roomOptionsHost,e,t)}_renderBadgeGroup(e,t,a,i,o,r,s,n,d){return function(e,t,a,i,o,r,s,n,d,c){const l=e._hass,h=a.length+i.length;if(0===h)return $.qy``;const u=r.badges||[],p=a.length>0&&a.every(e=>u.includes(e)),m=a.some(e=>u.includes(e))&&!p,g=new Set(n||[]),v=new Set(d||[]),y=e=>(0,_.LN)(e,s.has(e),g,v),b=c.has("badges");return $.qy`
    <div class="entity-group" data-group="badges">
      <div class="entity-group-header" @click=${()=>e._toggleGroupExpand(t,"badges")}>
        <input
          type="checkbox"
          class="group-checkbox"
          data-area-id=${t}
          data-group="badges"
          ?checked=${!p}
          .indeterminate=${m}
          @click=${e=>e.stopPropagation()}
          @change=${i=>{i.stopPropagation();const o=i.target.checked;e._groupVisibilityChanged(t,"badges",o,a)}}
        />
        <ha-icon icon="mdi:checkbox-multiple-blank-circle"></ha-icon>
        <span class="group-name">${(0,A.kg)("editor.domain_badges")}</span>
        <span class="entity-count">(${h})</span>
        <button
          class="expand-button-small ${b?"expanded":""}"
          @click=${a=>{a.stopPropagation(),e._toggleGroupExpand(t,"badges")}}
        >
          <span class="expand-icon-small">&#x25B6;</span>
        </button>
      </div>
      ${b?$.qy`
              <div class="entity-list" data-area-id=${t} data-group="badges">
                ${a.map(a=>{const i=l.states[a],o=i?.attributes.friendly_name||a.split(".")[1].replace(/_/g," "),r=u.includes(a),s=y(a);return $.qy`
                    <div class="entity-item">
                      <input
                        type="checkbox"
                        class="entity-checkbox"
                        ?checked=${!r}
                        @change=${i=>e._entityVisibilityChanged(t,"badges",a,i.target.checked)}
                      />
                      <span class="entity-name">${o}</span>
                      <input
                        type="checkbox"
                        class="badge-name-checkbox"
                        ?checked=${s}
                        title=${(0,A.kg)("editor.badges_show_name")}
                        @change=${i=>e._badgeShowNameChanged(t,a,i.target.checked)}
                      />
                      <span class="badge-name-label">${(0,A.kg)("editor.badges_name_short")}</span>
                      <span class="entity-id">${a}</span>
                    </div>
                  `})}
                ${i.length>0?$.qy`
                        <div class="badge-separator">${(0,A.kg)("editor.badges_additional")}</div>
                        ${i.map(a=>{const i=l.states[a],o=i?.attributes.friendly_name||a.split(".")[1].replace(/_/g," "),r=y(a);return $.qy`
                            <div class="entity-item badge-additional-item">
                              <span class="entity-name">${o}</span>
                              <input
                                type="checkbox"
                                class="badge-name-checkbox"
                                ?checked=${r}
                                title=${(0,A.kg)("editor.badges_show_name")}
                                @change=${i=>e._badgeShowNameChanged(t,a,i.target.checked)}
                              />
                              <span class="badge-name-label">${(0,A.kg)("editor.badges_name_short")}</span>
                              <span class="entity-id">${a}</span>
                              <button
                                class="badge-remove-btn"
                                title=${(0,A.kg)("editor.badges_remove")}
                                @click=${()=>e._badgeAdditionalChanged(t,a,!1)}
                              >
                                &#x2715;
                              </button>
                            </div>
                          `})}
                      `:$.s6}
                ${o.length>0?$.qy`
                        <div class="badge-add-section">
                          <select class="badge-entity-picker" data-area-id=${t}>
                            <option value="">${(0,A.kg)("editor.badges_select_entity")}</option>
                            ${o.map(e=>$.qy` <option value=${e.entity_id}>${e.name} (${e.entity_id})</option> `)}
                          </select>
                          <button class="badge-add-button" @click=${a=>e._addBadgeFromPicker(a,t)}>
                            ${(0,A.kg)("editor.badges_add")}
                          </button>
                        </div>
                      `:$.s6}
              </div>
            `:$.s6}
    </div>
  `}(this._roomOptionsHost,e,t,a,i,o,r,s,n,d)}async _loadAreaEntities(e){if(!this._hass)return;const t=(0,F.NS)(e,this._hass,this._config),a=(0,F.vZ)(t,this._hass,(0,F.H2)(t,this._hass),{includeCameras:!1}),i=x(e,this._config),o=C(e,this._config),r=(0,F.Rl)(t,this._hass,this._config.battery_critical_threshold),s=b(e,this._config),n=(0,F.OT)(t,this._hass,[...r,...s]),d=w(r,this._hass),{namesVisible:c,namesHidden:l}=f(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:a,hiddenEntities:i,entityOrders:o,badgeCandidates:r,additionalBadges:s,availableEntities:n,defaultShowNames:d,namesVisible:c,namesHidden:l}),this.requestUpdate()}_refreshAreaCache(e){if(!this._hass||!this._areaEntitiesCache.has(e))return;const t=this._areaEntitiesCache.get(e).groupedEntities,a=x(e,this._config),i=C(e,this._config),o=(0,F.NS)(e,this._hass,this._config),r=(0,F.Rl)(o,this._hass,this._config.battery_critical_threshold),s=b(e,this._config),n=(0,F.OT)(o,this._hass,[...r,...s]),d=w(r,this._hass),{namesVisible:c,namesHidden:l}=f(e,this._config);this._areaEntitiesCache.set(e,{groupedEntities:t,hiddenEntities:a,entityOrders:i,badgeCandidates:r,additionalBadges:s,availableEntities:n,defaultShowNames:d,namesVisible:c,namesHidden:l})}_toggleChanged(e,t,a){if(!this._hass)return;const i={...this._config,[e]:t};t===D(e,this._config,a)&&Reflect.deleteProperty(i,e),this._config=i,this._fireConfigChanged(i)}_setCctvOptions(e){if(!this._hass)return;const t={...this._config,...e};this._config=t,this._fireConfigChanged(t)}_simpleOptionChanged(e,t,a){const i={...this._config};t===D(e,this._config,a)?delete i[e]:i[e]=t,this._config=i,this._fireConfigChanged(this._config)}_addCustomView(){const e=[...this._config.custom_views||[]];e.push({title:(0,A.kg)("editor.new_view"),path:`custom-view-${e.length+1}`,icon:"mdi:card-text-outline",yaml:"",parsed_config:void 0});const t={...this._config,custom_views:e};this._config=t,this._fireConfigChanged(t)}async _loadRefDashboards(){if(this._refDashboardsLoading||!this._hass)return;this._refDashboardsLoading=!0;const e=[];try{const t=await this._hass.callWS({type:"lovelace/dashboards/list"}),a=[{url_path:"lovelace",title:(0,A.kg)("editor.ref_default_dashboard")},...t.filter(e=>e.url_path&&"lovelace"!==e.url_path)];await Promise.all(a.map(async t=>{try{const a=await this._hass.callWS({type:"lovelace/config",url_path:"lovelace"===t.url_path?null:t.url_path});if(a.strategy)return;const i=(a.views||[]).map((e,t)=>({path:"string"==typeof e.path?e.path:void 0,title:"string"==typeof e.title?e.title:void 0,icon:"string"==typeof e.icon?e.icon:void 0,index:t}));i.length&&e.push({...t,views:i})}catch{}}))}catch{}e.sort((e,t)=>e.title.localeCompare(t.title)),this._refDashboards=e,this._refDashboardsLoading=!1,this.requestUpdate()}_refDashboardChanged(e,t){const a=[...this._config.custom_views||[]];if(!a[e])return;a[e]={...a[e],ref_dashboard:t,ref_view:""};const i={...this._config,custom_views:a};this._config=i,this._fireConfigChanged(i)}_refViewChanged(e,t){const a=[...this._config.custom_views||[]],i=a[e];if(!i)return;const o=this._refDashboards?.find(e=>e.url_path===i.ref_dashboard),r=o?.views.find(e=>(e.path??String(e.index))===t),s={...i,ref_view:t};s.title||(s.title=r?.title||(0,A.kg)("editor.new_view")),s.icon||(s.icon=r?.icon||"mdi:link-variant"),s.path||(s.path=this._uniqueCustomViewPath(r?.path||`custom-view-${e+1}`,e)),a[e]=s;const n={...this._config,custom_views:a};this._config=n,this._fireConfigChanged(n)}_uniqueCustomViewPath(e,t){const a=new Set(["home","lights","covers","security","batteries","climate","maintenance","cctv",...Object.keys(this._hass?.areas||{}),...(this._config.custom_views||[]).filter((e,a)=>a!==t).map(e=>e.path).filter(e=>!!e)]);if(!a.has(e))return e;let i=1,o=`${e}-ref`;for(;a.has(o);)o=`${e}-ref${++i}`;return o}_removeCustomView(e){const t=[...this._config.custom_views||[]];t.splice(e,1);const a={...this._config};0===t.length?delete a.custom_views:a.custom_views=t,this._config=a,this._fireConfigChanged(a)}_updateCustomViewField(e,t,a){const i=[...this._config.custom_views||[]];if(!i[e])return;i[e]={...i[e],[t]:a};const o={...this._config,custom_views:i};this._config=o,this._fireConfigChanged(o)}_updateCustomViewAfterView(e,t){const a=[...this._config.custom_views||[]],i=a[e];if(!i)return;const o={...i};t?o.after_view=t:delete o.after_view,a[e]=o;const r={...this._config,custom_views:a};this._config=r,this._fireConfigChanged(r)}_updateCustomViewYaml(e,t){n(()=>{const a=[...this._config.custom_views||[]];a[e]&&(a[e]=l(a[e],t,"YAML muss ein Objekt ergeben"),this._applyConfig({...this._config,custom_views:a}))})}_customCardsHeadingChanged(e){const t=e.target.value.trim(),a={...this._config};t?a.custom_cards_heading=t:delete a.custom_cards_heading,this._config=a,this._fireConfigChanged(a)}_customCardsIconChanged(e){const t=e.target.value.trim(),a={...this._config};t?a.custom_cards_icon=t:delete a.custom_cards_icon,this._config=a,this._fireConfigChanged(a)}_removeCustomCard(e){const t=[...this._config.custom_cards||[]];t.splice(e,1);const a={...this._config};0===t.length?delete a.custom_cards:a.custom_cards=t,this._config=a,this._fireConfigChanged(a)}_updateCustomCardField(e,t,a){const i=[...this._config.custom_cards||[]];if(!i[e])return;i[e]={...i[e],[t]:a};const o={...this._config,custom_cards:i};this._config=o,this._fireConfigChanged(o)}_updateCustomCardYaml(e,t){n(()=>{const a=[...this._config.custom_cards||[]];a[e]&&(a[e]=l(a[e],t,"YAML muss ein Objekt oder Array ergeben"),this._applyYamlConfig({...this._config,custom_cards:a},a[e]._yaml_error))})}_addCustomSection(){const e=[...this._config.custom_sections||[]];e.push({title:"",icon:"",cards:[]});const t={...this._config,custom_sections:e};this._config=t,this._fireConfigChanged(t)}_removeCustomSection(e){const t=[...this._config.custom_sections||[]];t.splice(e,1);const a={...this._config};0===t.length?delete a.custom_sections:a.custom_sections=t,this._config=a,this._fireConfigChanged(a)}_updateCustomSectionField(e,t,a){const i=[...this._config.custom_sections||[]];if(!i[e])return;i[e]={...i[e],[t]:a};const o={...this._config,custom_sections:i};this._config=o,this._fireConfigChanged(o)}_updateCustomSectionYaml(e,t){n(()=>{const a=[...this._config.custom_sections||[]];a[e]&&(a[e]=l(a[e],t,(0,A.kg)("editor.custom_section_yaml_invalid")),this._applyYamlConfig({...this._config,custom_sections:a},a[e]._yaml_error))})}_removeCardFromSection(e,t){const a=[...this._config.custom_sections||[]];if(!a[e])return;const i={...a[e]},o=[...i.cards||[]];o.splice(t,1),i.cards=o,a[e]=i;const r={...this._config,custom_sections:a};this._config=r,this._fireConfigChanged(r)}_updateSectionCardField(e,t,a,i){const o=[...this._config.custom_sections||[]];if(!o[e])return;const r={...o[e]},s=[...r.cards||[]];if(!s[t])return;s[t]={...s[t],[a]:i},r.cards=s,o[e]=r;const n={...this._config,custom_sections:o};this._config=n,this._fireConfigChanged(n)}_updateSectionCardYaml(e,t,a){n(()=>{const i=[...this._config.custom_sections||[]];if(!i[e])return;const o=[...i[e].cards||[]];o[t]&&(o[t]=l(o[t],a,"YAML muss ein Objekt oder Array ergeben"),i[e]={...i[e],cards:o},this._applyYamlConfig({...this._config,custom_sections:i},o[t]._yaml_error))})}_getAreaCustomCards(e){return[...this._config.areas_options?.[e]?.custom_cards||[]]}_writeAreaCustomCards(e,t){this._applyConfig(m(this._config,e,e=>(0===t.length?delete e.custom_cards:e.custom_cards=t,e)))}_addAreaCustomCard(e){const t=this._getAreaCustomCards(e);t.push({mode:"yaml",position:"bottom",editor_title:"",yaml:"",parsed_config:void 0}),this._writeAreaCustomCards(e,t)}_removeAreaCustomCard(e,t){const a=this._getAreaCustomCards(e);t<0||t>=a.length||(a.splice(t,1),this._writeAreaCustomCards(e,a))}_updateAreaCustomCardField(e,t,a,i){n(()=>{const o=this._getAreaCustomCards(e);if(!o[t])return;const r={...o[t],[a]:i};"mode"===a&&"tile"!==i&&this._parseAreaCustomCardYamlConfig(r,r.yaml||""),"mode"===a&&"tile"===i&&delete r._yaml_error,o[t]=r,this._writeAreaCustomCards(e,o)})}_parseAreaCustomCardYamlConfig(e,t){if(e.yaml=t,delete e._yaml_error,t.trim())try{const a=s().load(t);if(a&&"object"==typeof a){if("section"===e.mode){if(!(Array.isArray(a)?a:[a]).every(e=>e&&"object"==typeof e&&Array.isArray(e.cards)))return e._yaml_error="Section-YAML muss ein Objekt oder Array mit cards enthalten",void(e.parsed_config=void 0)}e.parsed_config=a}else e._yaml_error="YAML muss ein Objekt oder Array ergeben",e.parsed_config=void 0}catch(t){const a=t instanceof Error?t.message.split("\n")[0]:"Ungültiges YAML";e._yaml_error=a||"Ungültiges YAML",e.parsed_config=void 0}else e.parsed_config=void 0}_updateAreaCustomCardYaml(e,t,a){n(()=>{const i=this._getAreaCustomCards(e);if(!i[t])return;const o={...i[t]};this._parseAreaCustomCardYamlConfig(o,a),i[t]=o,this._writeAreaCustomCards(e,i)})}_addCustomBadge(){const e=[...this._config.custom_badges||[]];e.push({yaml:"",parsed_config:void 0});const t={...this._config,custom_badges:e};this._config=t,this._fireConfigChanged(t)}_removeCustomBadge(e){const t=[...this._config.custom_badges||[]];t.splice(e,1);const a={...this._config};0===t.length?delete a.custom_badges:a.custom_badges=t,this._config=a,this._fireConfigChanged(a)}_updateCustomBadgeYaml(e,t){n(()=>{const a=[...this._config.custom_badges||[]];a[e]&&(a[e]=l(a[e],t,"YAML muss ein Objekt ergeben"),this._applyConfig({...this._config,custom_badges:a}))})}_areaVisibilityChanged(e,t){this._hass&&(t||(this._expandedAreas.delete(e),this._expandedGroups.delete(e),this._areaEntitiesCache.delete(e)),this._invalidateWeatherStartOptionsCaches(),this._applyConfig(function(e,t,a){return y(e,e=>p(e,"hidden",u(e.hidden,t,!a)))}(this._config,e,t)))}_areaNavPinChanged(e,t){this._applyConfig(function(e,t,a){return y(e,e=>p(e,"nav_items",u(e.nav_items,t,a)))}(this._config,e,t))}_toggleAreaExpand(e,t){e.stopPropagation();const a=new Set(this._expandedAreas);if(a.has(t)){a.delete(t);const e=new Map(this._expandedGroups);e.delete(t),this._expandedGroups=e}else a.add(t),this._areaEntitiesCache.has(t)||this._loadAreaEntities(t);this._expandedAreas=a}_toggleGroupExpand(e,t){const a=new Map(this._expandedGroups),i=new Set(a.get(e)||[]);i.has(t)?i.delete(t):i.add(t),i.size>0?a.set(e,i):a.delete(e),this._expandedGroups=a}_groupVisibilityChanged(e,t,a,i){this._hass&&(this._applyConfig(function(e,t,a,i,o){const r=e.areas_options?.[t]?.groups_options?.[a]?.hidden??[];return v(e,t,a,o?r.filter(e=>!i.includes(e)):[...new Set([...r,...i])])}(this._config,e,t,i,a)),this._refreshAreaCache(e))}_entityVisibilityChanged(e,t,a,i){this._hass&&("badges_additional"!==t?"badges_show_name"!==t?(this._applyConfig(function(e,t,a,i,o){const r=e.areas_options?.[t]?.groups_options?.[a]?.hidden;return v(e,t,a,u(r,i,!o))}(this._config,e,t,a,i)),this._refreshAreaCache(e)):this._badgeShowNameChanged(e,a,i):this._badgeAdditionalChanged(e,a,i))}_badgeAdditionalChanged(e,t,a){this._config&&(this._applyConfig(function(e,t,a,i){return g(e,t,"badges",e=>p(e,"additional",u(e.additional,a,i)))}(this._config,e,t,a)),this._refreshAreaCache(e))}_badgeShowNameChanged(e,t,a){if(!this._config||!this._hass)return;const i=this._hass.states[t]?.attributes?.device_class;this._applyConfig(function(e,t,a,i,o){return g(e,t,"badges",e=>{const t=i!==o,r=u(e.names_visible,a,t&&i),s=u(e.names_hidden,a,t&&!i);return p(p(e,"names_visible",r),"names_hidden",s)})}(this._config,e,t,a,(0,_.g7)(i))),this._refreshAreaCache(e)}_addBadgeFromPicker(e,t){e.stopPropagation();const a=this.shadowRoot.querySelector(`.badge-entity-picker[data-area-id="${t}"]`);if(!a||!a.value)return;const i=a.value;this._badgeAdditionalChanged(t,i,!0),a.value=""}_getAreaOrder(){if(!this._hass)return[];const e=this._getNormalizedAreasDisplay()?.order;return e&&e.length>0?[...e]:Object.keys(this._hass.areas||{})}_updateAreaOrder(e){var t,a;this._invalidateWeatherStartOptionsCaches(),this._applyConfig((t=this._config,a=e,{...t,areas_display:{...t.areas_display,order:a}}))}_applyConfig(e){this._config=e,this._fireConfigChanged(e)}_applyYamlConfig(e,t){if(t)return this._config=e,void this.requestUpdate();this._applyConfig(e)}_fireConfigChanged(e){this._isUpdatingConfig=!0;const t=function(e){const t={...e};return delete t.overview_layout,delete t.sections_order,t}(e);delete t.inline_editor,t.custom_views&&(t.custom_views=t.custom_views.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_cards&&(t.custom_cards=t.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_badges&&(t.custom_badges=t.custom_badges.map(e=>{const t={...e};return delete t._yaml_error,t})),t.custom_sections&&(t.custom_sections=t.custom_sections.map(e=>{const t={...e};return delete t._yaml_error,t.cards=(e.cards||[]).map(e=>{const t={...e};return delete t._yaml_error,t}),t})),t.weather_start_layout_items&&(t.weather_start_layout_items=t.weather_start_layout_items.map(e=>{const t={...e};return delete t._yaml_error,t}));const a=this._getNormalizedAreasDisplay(t);a?t.areas_display=a:delete t.areas_display;const i=this._hass?new Set(Object.keys(this._hass.areas||{})):null;if(t.areas_options){const e=function(e){if(!e)return;const t={};for(const[a,i]of Object.entries(e)){const e={...i};delete e.webrtc_cameras,Object.keys(e).length>0&&(t[a]=e)}return Object.keys(t).length>0?t:void 0}(t.areas_options),a={};for(const[t,o]of Object.entries(e||{})){if(i&&!i.has(t))continue;const e={...o};if(o.custom_cards&&(e.custom_cards=o.custom_cards.map(e=>{const t={...e};return delete t._yaml_error,t})),o.view_override){const t={...o.view_override};delete t._yaml_error,e.view_override=t}Object.keys(e).length>0&&(a[t]=e)}Object.keys(a).length>0?t.areas_options=a:delete t.areas_options}this._config=e,function(e,t){e.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}(this,t),setTimeout(()=>{this._isUpdatingConfig=!1},0)}_openCardPickerForSection(e){this._openCardPicker(t=>{const a=s().dump(t).trim(),i=[...this._config.custom_sections||[]];if(!i[e])return;const o={...i[e]};o.cards=[...o.cards||[],{editor_title:"",yaml:a,parsed_config:t}],i[e]=o;const r={...this._config,custom_sections:i};this._config=r,this._fireConfigChanged(r)})}_openCardPickerForAreaCustomCard(e){this._openCardPicker(t=>{const a=s().dump(t).trim(),i=this._getAreaCustomCards(e);i.push({mode:"yaml",position:"bottom",editor_title:"",yaml:a,parsed_config:t}),this._writeAreaCustomCards(e,i)})}_openCardEditorForCustomCard(e){n(()=>{const t=this._config.custom_cards?.[e],a=this._getEditableYamlCardConfig(t);a&&this._openCardPicker(t=>{this._updateCustomCardYaml(e,s().dump(t).trim())},a)})}_openCardEditorForSectionCard(e,t){n(()=>{const a=this._config.custom_sections?.[e]?.cards?.[t],i=this._getEditableYamlCardConfig(a);i&&this._openCardPicker(a=>{this._updateSectionCardYaml(e,t,s().dump(a).trim())},i)})}_openCardEditorForAreaCustomCard(e,t){n(()=>{const a=this._getAreaCustomCards(e)[t],i=this._getEditableAreaCardConfig(a);i&&this._openCardPicker(a=>{const i=this._getAreaCustomCards(e);if(!i[t])return;const o={...i[t],mode:"yaml",yaml:s().dump(a).trim(),parsed_config:a};delete o._yaml_error,i[t]=o,this._writeAreaCustomCards(e,i)},i)})}_getEditableAreaCardConfig(e){return function(e,t){return t?"tile"===(t.mode||"yaml")&&t.entity?{type:"tile",entity:t.entity}:e._getEditableYamlCardConfig(t):null}(this._cardPickerHost,e)}_getEditableYamlCardConfig(e){return function(e,t){if(t?.parsed_config&&"object"==typeof t.parsed_config&&!Array.isArray(t.parsed_config))return t.parsed_config;if(!t?.yaml?.trim())return null;try{const e=s().load(t.yaml);return e&&"object"==typeof e&&!Array.isArray(e)?e:null}catch{return null}}(this._cardPickerHost,e)}_openCardPicker(e,t){n(()=>{!function(e,t,a){e._cardPickerCallback=t,e._cardPickerConfig=a||null,e._cardPickerOpen=!0,e._cardPickerStep=a?"editor":"type",e._cardPickerSearch="",e._cardPickerSelectedType="string"==typeof a?.type?a.type:"",e._cardPickerYaml=a?s().dump(a).trim():"",e._cardPickerHasVisualEditor=!1}(this._cardPickerHost,e,t)})}_closeCardPicker(){return function(e){e._cardPickerOpen=!1,e._cardPickerCallback=null,e._cardPickerConfig=null;const t=e.shadowRoot?.querySelector(".card-editor-visual-host");t?.replaceChildren()}(this._cardPickerHost)}_selectCardType(e){return function(e,t){e._cardPickerSelectedType=t,e._cardPickerStep="editor";const a=S.find(e=>e.type===t);if(a){e._cardPickerYaml=a.template;try{const t=s().load(a.template);t&&"object"==typeof t&&!Array.isArray(t)&&(e._cardPickerConfig=t)}catch{}}else e._cardPickerYaml=`type: ${t}\n`,e._cardPickerConfig={type:t};e._cardPickerHasVisualEditor=!1}(this._cardPickerHost,e)}_cardPickerYamlChanged(e){return function(e,t){const a=t.target.value;e._cardPickerYaml=a;try{const t=s().load(a);t&&"object"==typeof t&&!Array.isArray(t)&&(e._cardPickerConfig=t)}catch{}}(this._cardPickerHost,e)}_confirmCardPicker(){var e;(e=this._cardPickerHost)._cardPickerConfig&&e._cardPickerCallback&&(e._cardPickerCallback(e._cardPickerConfig),e._closeCardPicker())}updated(e){super.updated(e),this._openingMeasured||((0,V.PZ)("editor-open"),this._openingMeasured=!0),this._cardPickerOpen&&"editor"===this._cardPickerStep&&!this._cardPickerHasVisualEditor&&this._tryMountVisualCardEditor()}_tryMountVisualCardEditor(){return function(e){const t=e.shadowRoot?.querySelector(".card-editor-visual-host");if(t&&!t.firstChild&&customElements.get("hui-card-element-editor"))try{const a=document.createElement("hui-card-element-editor");a.hass=e._hass,a.value=e._cardPickerConfig||{type:e._cardPickerSelectedType},a.addEventListener("config-changed",t=>{const a=t.detail?.config;a&&"object"==typeof a&&(e._cardPickerConfig=a,e._cardPickerYaml=s().dump(a).trim(),e.requestUpdate("_cardPickerYaml"))}),t.appendChild(a),e._cardPickerHasVisualEditor=!0}catch{}}(this._cardPickerHost)}_renderCardPickerOverlay(){return"type"===(e=this._cardPickerHost)._cardPickerStep?e._renderCardTypePicker():e._renderCardEditor();var e}_renderCardTypePicker(){return function(e){const t=e._cardPickerSearch.toLowerCase(),a=S.filter(e=>!t||e.type.includes(t)||e.name.toLowerCase().includes(t)),i=(window.customCards||[]).filter(e=>{const a=(e.type||"").toLowerCase(),i=(e.name||"").toLowerCase();return"webrtc-camera"!==a&&"custom:webrtc-camera"!==a&&!i.includes("webrtc")&&(!t||a.includes(t)||i.includes(t))});return $.qy`
    <div class="card-picker-overlay" @click=${e._handlePickerOverlayClick}>
      <div class="card-picker-dialog" @click=${e=>e.stopPropagation()}>
        <div class="card-picker-header">
          <span class="card-picker-header-title">Karte hinzufügen</span>
          <button class="card-picker-icon-btn" @click=${e._closeCardPicker} title="Schließen">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="card-picker-search-row">
          <input
            type="text"
            placeholder="Kartentyp suchen…"
            .value=${e._cardPickerSearch}
            @input=${t=>{e._cardPickerSearch=t.target.value,e.requestUpdate()}}
          />
        </div>
        <div class="card-type-grid">
          ${a.map(t=>$.qy`
              <button class="card-type-btn" @click=${()=>e._selectCardType(t.type)}>
                <ha-icon icon=${t.icon}></ha-icon>
                <span>${t.name}</span>
              </button>
            `)}
          ${i.map(t=>$.qy`
              <button class="card-type-btn" @click=${()=>e._selectCardType(t.type)}>
                <ha-icon icon="mdi:puzzle"></ha-icon>
                <span>${t.name||t.type}</span>
              </button>
            `)}
        </div>
      </div>
    </div>
  `}(this._cardPickerHost)}_renderCardEditor(){return function(e){const t=S.find(t=>t.type===e._cardPickerSelectedType)?.name||e._cardPickerSelectedType;return $.qy`
    <div class="card-picker-overlay" @click=${e._handlePickerOverlayClick}>
      <div class="card-picker-dialog" @click=${e=>e.stopPropagation()}>
        <div class="card-picker-header">
          <button
            class="card-picker-icon-btn"
            @click=${()=>{e._cardPickerStep="type";const t=e.shadowRoot?.querySelector(".card-editor-visual-host");t?.replaceChildren(),e._cardPickerHasVisualEditor=!1}}
            title="Zurück"
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <span class="card-picker-header-title">${t}</span>
          <button class="card-picker-icon-btn" @click=${e._closeCardPicker} title="Schließen">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="card-editor-content">
          <div class="card-editor-visual-host"></div>
          ${e._cardPickerHasVisualEditor?$.s6:$.qy`
                  <div class="card-editor-yaml-label">YAML-Konfiguration:</div>
                  <textarea
                    class="card-editor-yaml-area"
                    .value=${e._cardPickerYaml}
                    @input=${e._cardPickerYamlChanged}
                    spellcheck="false"
                  ></textarea>
                `}
        </div>
        <div class="card-picker-footer">
          <button class="btn-secondary" @click=${e._closeCardPicker}>Abbrechen</button>
          <button class="btn-primary" @click=${e._confirmCardPicker}>Speichern</button>
        </div>
      </div>
    </div>
  `}(this._cardPickerHost)}createWeatherLayoutHost(){const e=this;return{_addWeatherStartArea:this._addWeatherStartArea.bind(this),_addWeatherStartFloor:this._addWeatherStartFloor.bind(this),_addWeatherStartSection:this._addWeatherStartSection.bind(this),_addWeatherStartSummaries:this._addWeatherStartSummaries.bind(this),get _config(){return e._config},set _config(t){e._config=t},_countNestedFixedGrids:this._countNestedFixedGrids.bind(this),get _expandedWeatherBlocks(){return e._expandedWeatherBlocks},set _expandedWeatherBlocks(t){e._expandedWeatherBlocks=t},_getCustomCardEditorLabel:this._getCustomCardEditorLabel.bind(this),_getWeatherStartAreaOptions:this._getWeatherStartAreaOptions.bind(this),_getWeatherStartCustomCardIndex:this._getWeatherStartCustomCardIndex.bind(this),_getWeatherStartCustomSectionIndex:this._getWeatherStartCustomSectionIndex.bind(this),_getWeatherStartFloorOptions:this._getWeatherStartFloorOptions.bind(this),_getWeatherStartItemMeta:this._getWeatherStartItemMeta.bind(this),_getWeatherStartLayoutItems:this._getWeatherStartLayoutItems.bind(this),_handleWeatherStartDragEnd:this._handleWeatherStartDragEnd.bind(this),_handleWeatherStartDragLeave:this._handleWeatherStartDragLeave.bind(this),_handleWeatherStartDragOver:this._handleWeatherStartDragOver.bind(this),_handleWeatherStartDragStart:this._handleWeatherStartDragStart.bind(this),_handleWeatherStartDrop:this._handleWeatherStartDrop.bind(this),_isWeatherStartItemDisabled:this._isWeatherStartItemDisabled.bind(this),_openCardEditorForCustomCard:this._openCardEditorForCustomCard.bind(this),_openCardEditorForSectionCard:this._openCardEditorForSectionCard.bind(this),_openCardPickerForSection:this._openCardPickerForSection.bind(this),_openCardPickerForWeatherStartCard:this._openCardPickerForWeatherStartCard.bind(this),_removeCardFromSection:this._removeCardFromSection.bind(this),_removeWeatherStartItem:this._removeWeatherStartItem.bind(this),_renderWeatherStartCustomCardEditor:this._renderWeatherStartCustomCardEditor.bind(this),_renderWeatherStartCustomSectionEditor:this._renderWeatherStartCustomSectionEditor.bind(this),_resetWeatherStartItemYaml:this._resetWeatherStartItemYaml.bind(this),_toggleWeatherBlockExpanded:this._toggleWeatherBlockExpanded.bind(this),_toggleWeatherStartItemStack:this._toggleWeatherStartItemStack.bind(this),_updateCustomCardField:this._updateCustomCardField.bind(this),_updateCustomCardYaml:this._updateCustomCardYaml.bind(this),_updateCustomSectionField:this._updateCustomSectionField.bind(this),_updateSectionCardField:this._updateSectionCardField.bind(this),_updateSectionCardYaml:this._updateSectionCardYaml.bind(this),_updateWeatherStartItemYaml:this._updateWeatherStartItemYaml.bind(this),_weatherStartSummarySizeChanged:this._weatherStartSummarySizeChanged.bind(this),_weatherStartTitleChanged:this._weatherStartTitleChanged.bind(this),_parseWeatherStartItemYaml:this._parseWeatherStartItemYaml.bind(this),requestUpdate:this.requestUpdate.bind(this),_saveWeatherStartLayoutItems:this._saveWeatherStartLayoutItems.bind(this),_normalizeWeatherStartLayoutItems:this._normalizeWeatherStartLayoutItems.bind(this),_fireConfigChanged:this._fireConfigChanged.bind(this)}}createOptionPanelHost(){const e=this;return{get hass(){return e._hass},get config(){return e._config},editor:e,entityListState:this._entityListState,checkbox:this._renderCheckbox.bind(this),toggle:this._toggleChanged.bind(this),setOption:this._simpleOptionChanged.bind(this),update:t=>{const a={...e._config};t(a),e._config=a,e._fireConfigChanged(a)},requestUpdate:this.requestUpdate.bind(this),entityOptions:this._getAllEntitiesForSelect.bind(this),filterEntities:this._getFilteredEntities.bind(this),sortedAreas:this._getSortedAreas.bind(this)}}createRoomOptionsHost(){const e=this;return{_addAreaCustomCard:this._addAreaCustomCard.bind(this),_addBadgeFromPicker:this._addBadgeFromPicker.bind(this),_areaDisplayTypeOverrideChanged:this._areaDisplayTypeOverrideChanged.bind(this),get _areaEntitiesCache(){return e._areaEntitiesCache},set _areaEntitiesCache(t){e._areaEntitiesCache=t},_areaNavPinChanged:this._areaNavPinChanged.bind(this),_areaVisibilityChanged:this._areaVisibilityChanged.bind(this),_badgeAdditionalChanged:this._badgeAdditionalChanged.bind(this),_badgeShowNameChanged:this._badgeShowNameChanged.bind(this),get _config(){return e._config},set _config(t){e._config=t},_entityVisibilityChanged:this._entityVisibilityChanged.bind(this),get _expandedAreas(){return e._expandedAreas},set _expandedAreas(t){e._expandedAreas=t},get _expandedGroups(){return e._expandedGroups},set _expandedGroups(t){e._expandedGroups=t},_getAreaCustomCards:this._getAreaCustomCards.bind(this),_getCustomCardEditorLabel:this._getCustomCardEditorLabel.bind(this),_groupVisibilityChanged:this._groupVisibilityChanged.bind(this),_handleDragEnd:this._handleDragEnd.bind(this),_handleDragLeave:this._handleDragLeave.bind(this),_handleDragOver:this._handleDragOver.bind(this),_handleDragStart:this._handleDragStart.bind(this),_handleDrop:this._handleDrop.bind(this),get _hass(){return e._hass},set _hass(t){e._hass=t},_openCardEditorForAreaCustomCard:this._openCardEditorForAreaCustomCard.bind(this),_openCardPickerForAreaCustomCard:this._openCardPickerForAreaCustomCard.bind(this),_openDiagnosticLocation:this._openDiagnosticLocation.bind(this),_removeAreaCustomCard:this._removeAreaCustomCard.bind(this),_renderAreaCustomCardItem:this._renderAreaCustomCardItem.bind(this),_renderAreaCustomCardsSection:this._renderAreaCustomCardsSection.bind(this),_renderAreaDisplayTypeOverride:this._renderAreaDisplayTypeOverride.bind(this),_renderAreaEntities:this._renderAreaEntities.bind(this),_renderAreaViewOverride:this._renderAreaViewOverride.bind(this),_renderBadgeGroup:this._renderBadgeGroup.bind(this),_renderStackOrderPanel:this._renderStackOrderPanel.bind(this),_toggleAreaExpand:this._toggleAreaExpand.bind(this),_toggleGroupExpand:this._toggleGroupExpand.bind(this),_updateAreaCustomCardField:this._updateAreaCustomCardField.bind(this),_updateAreaCustomCardYaml:this._updateAreaCustomCardYaml.bind(this),_updateAreaViewOverride:this._updateAreaViewOverride.bind(this),_fireConfigChanged:this._fireConfigChanged.bind(this)}}createCustomViewsHost(){const e=this;return{get _config(){return e._config},get _hass(){return e._hass},get _refDashboards(){return e._refDashboards},_getSortedAreas:e._getSortedAreas.bind(e),_addCustomView:e._addCustomView.bind(e),_addCustomRefView:e._addCustomRefView,_loadRefDashboards:e._loadRefDashboards.bind(e),_refDashboardChanged:e._refDashboardChanged.bind(e),_refViewChanged:e._refViewChanged.bind(e),_removeCustomView:e._removeCustomView.bind(e),_updateCustomViewField:e._updateCustomViewField.bind(e),_updateCustomViewAfterView:e._updateCustomViewAfterView.bind(e),_updateCustomViewYaml:e._updateCustomViewYaml.bind(e)}}createCustomContentHost(){const e=this;return{get _config(){return e._config},customViewsHost:this._customViewsHost,_sectionLabelKey:Le,_getCustomCardEditorLabel:this._getCustomCardEditorLabel.bind(this),_customCardsHeadingChanged:this._customCardsHeadingChanged.bind(this),_customCardsIconChanged:this._customCardsIconChanged.bind(this),_openCardPickerForCustomCard:()=>e._openCardPickerForCustomCard(),_removeCustomCard:this._removeCustomCard.bind(this),_updateCustomCardField:this._updateCustomCardField.bind(this),_updateCustomCardYaml:this._updateCustomCardYaml.bind(this),_openCardEditorForCustomCard:this._openCardEditorForCustomCard.bind(this),_addCustomSection:this._addCustomSection.bind(this),_removeCustomSection:this._removeCustomSection.bind(this),_updateCustomSectionYaml:this._updateCustomSectionYaml.bind(this),_updateCustomSectionField:this._updateCustomSectionField.bind(this),_removeCardFromSection:this._removeCardFromSection.bind(this),_updateSectionCardField:this._updateSectionCardField.bind(this),_updateSectionCardYaml:this._updateSectionCardYaml.bind(this),_openCardEditorForSectionCard:this._openCardEditorForSectionCard.bind(this),_openCardPickerForSection:this._openCardPickerForSection.bind(this),_addCustomBadge:this._addCustomBadge.bind(this),_removeCustomBadge:this._removeCustomBadge.bind(this),_updateCustomBadgeYaml:this._updateCustomBadgeYaml.bind(this)}}createCardPickerHost(){const e=this;return{get _cardPickerHasVisualEditor(){return e._cardPickerHasVisualEditor},set _cardPickerHasVisualEditor(t){e._cardPickerHasVisualEditor=t},get _cardPickerSearch(){return e._cardPickerSearch},set _cardPickerSearch(t){e._cardPickerSearch=t},get _cardPickerSelectedType(){return e._cardPickerSelectedType},set _cardPickerSelectedType(t){e._cardPickerSelectedType=t},get _cardPickerStep(){return e._cardPickerStep},set _cardPickerStep(t){e._cardPickerStep=t},get _cardPickerYaml(){return e._cardPickerYaml},set _cardPickerYaml(t){e._cardPickerYaml=t},_cardPickerYamlChanged:this._cardPickerYamlChanged.bind(this),_closeCardPicker:this._closeCardPicker.bind(this),_confirmCardPicker:this._confirmCardPicker.bind(this),_handlePickerOverlayClick:this._handlePickerOverlayClick.bind(this),_renderCardEditor:this._renderCardEditor.bind(this),_renderCardTypePicker:this._renderCardTypePicker.bind(this),_selectCardType:this._selectCardType.bind(this),requestUpdate:this.requestUpdate.bind(this),get shadowRoot(){return e.shadowRoot},get _cardPickerCallback(){return e._cardPickerCallback},set _cardPickerCallback(t){e._cardPickerCallback=t},get _cardPickerConfig(){return e._cardPickerConfig},set _cardPickerConfig(t){e._cardPickerConfig=t},get _cardPickerOpen(){return e._cardPickerOpen},set _cardPickerOpen(t){e._cardPickerOpen=t},get _hass(){return e._hass},set _hass(t){e._hass=t},_getEditableYamlCardConfig:this._getEditableYamlCardConfig.bind(this)}}}Me.properties={_config:{state:!0},_expandedAreas:{state:!0},_expandedGroups:{state:!0},_expandedWeatherBlocks:{state:!0},_cardPickerOpen:{state:!0},_cardPickerStep:{state:!0},_cardPickerSearch:{state:!0},_optionSearch:{state:!0},_showChangedOnly:{state:!0},_cardPickerSelectedType:{state:!0},_cardPickerYaml:{state:!0},_cardPickerHasVisualEditor:{state:!0}},Me.styles=oe,customElements.define("dashboard-strategy-editor",Me)},7773(e,t,a){a.r(t),a.d(t,{editorTranslationsReady:()=>r});const i=JSON.parse('{"editor":{"diagnostics_title":"Dashboard check","diagnostics_check":"Check configuration","diagnostics_help":"Checks structured entity references. Templates and stream names are not checked. Settings are preserved.","diagnostics_ok":"No missing or unavailable entity references found.","diagnostics_missing":"Entity missing","diagnostics_unavailable":"Currently unavailable","diagnostics_open":"Open editor section","entity_existing_restricted":"Existing diagnostic/configuration entry","override_active":"Custom room layout","override_active_help":"Replaces the automatic room view. Click to edit its YAML.","section_order":"Section Order","section_order_desc":"Drag sections to reorder them on the overview page. Empty sections are hidden automatically.","section_hidden":"hidden","stack_order":"Room block order","stack_order_desc":"Drag blocks to set their order in this room view.","stack_order_inactive":"Not present in this room","energy_link_dashboard":"Link to energy dashboard","target_section":"Show in","section_overview":"Overview","section_overview_details":"Additional overview options","theme":"Theme:","overview_max_columns":"Maximum columns:","overview_area_card_columns":"Area cards per row:","columns_full":"One","weather_start_weather_mode":"Weather display:","weather_mode_full":"Full","weather_mode_compact_hourly":"Compact with 6 hours","weather_start_date_card":"Date card:","date_card_markdown":"Native Markdown card","theme_default":"Home Assistant default","theme_desc":"Select a theme for all automatically generated dashboard views. Custom views with their own YAML theme keep that setting.","background_image":"Background image","background_image_desc":"Pick an image in the media dialog or upload it directly. Alternatively use a path or URL such as /local/background.jpg.","background_opacity":"Opacity","background_fixed":"Fix background while scrolling","weather_entity":"Weather entity:","weather_entity_auto":"Auto-detect","weather_entity_desc":"Manually select a weather entity. If nothing is selected, the first available weather entity is used automatically.","clock_size":"Clock size:","date_size":"Date size:","show_clock_card":"Show clock card","show_clock_card_desc":"Shows the clock card on the overview.","show_person_badges":"Show person badges","show_person_badges_desc":"Shows the automatically generated person badges in the overview header. Disable this if you want to replace them with custom badges.","person_badge_layout":"Person badge layout:","person_badge_layout_desc":"Controls whether person badges only show the name, include the current state, or include state and relative time.","person_badge_layout_minimal":"Name only","person_badge_layout_with_state":"Name and state","person_badge_layout_with_state_and_time":"Name, state, and time","alarm_entity":"Alarm entity:","alarm_none":"None (clock full width)","alarm_desc":"Select an alarm control panel entity. When the clock card is active, the alarm panel is shown next to it. Without the clock card, the alarm panel takes the full width.","house_mode_entity":"House mode helper:","house_mode_none":"None (no house mode)","house_mode_desc":"Select an input_select or select helper. It is shown on the overview as a dropdown below the clock.","show_search_card":"Show search card","show_search_card_desc":"Shows the custom:search-card directly below the clock on the overview.","show_search_card_missing":"Requires <strong>custom:search-card</strong> and <strong>card-tools</strong>. Please install both components to use this feature.","search_card_variant":"Search presentation","search_card_variant_custom":"Interactive custom search card","search_card_variant_tip":"Native search hint","show_unavailable_alert_badge":"Show unavailable alert badge","show_unavailable_alert_badge_desc":"Adds a header badge with the count of visible entities currently unavailable.","show_now_playing_badge":"Show now playing badge","show_now_playing_badge_desc":"Adds a header badge for the first visible media player that is currently playing.","show_sun_badge":"Show sun badge","show_sun_badge_desc":"Adds a sunrise or sunset badge for sun.sun in the overview header.","show_updates_badge":"Show updates badge","show_updates_badge_desc":"Adds a header badge with the count of visible update entities that have pending updates.","section_summaries":"Summaries","panel_navigation":"Jump to settings panel","compact_overview_summaries":"Compact summaries on the standard overview","compact_overview_summaries_desc":"Uses smaller summary cards on the standard overview. Custom layouts and the weather start page stay unchanged.","section_summary_details":"Summary details","columns_2":"2 columns (2x2 grid)","columns_4":"4 columns (1x4 row)","columns_desc":"Choose how summary cards should be displayed. The layout adjusts automatically when cards are hidden.","security_options":"Security view","group_security_by_areas":"Group security by areas","group_security_by_areas_desc":"Uses an area-oriented layout similar to Home Assistant\'s security panel.","show_security_activity":"Show 24-hour security activity","show_security_activity_desc":"Adds a native logbook card when the logbook integration is available.","security_activity_position":"Activity position","position_start":"Start","position_end":"End","security_extra_entities":"Additional entity IDs (comma-separated)","show_light_summary":"Show light summary","show_light_view":"Always provide lights view","show_light_view_desc":"Generates /lights even when the light summary is hidden.","group_lights_by_floors":"Group lights by floors","group_lights_by_floors_desc":"Groups lights in the lights view by floors. Each floor gets its own section with on/off buttons.","group_lights_by_areas":"Group lights by areas","group_lights_by_areas_desc":"Groups lights by area, nested below floors when both options are enabled.","group_covers_by_floors":"Group covers by floors","group_covers_by_floors_desc":"Groups covers in the covers view by floors. Each floor gets its own subsection with a heading. Awnings and windows remain unsplit.","group_covers_by_areas":"Group covers by areas","group_covers_by_areas_desc":"Groups covers by area, nested below floors when both options are enabled.","nested_light_groups":"Show nested light groups","nested_light_groups_desc":"Shows light groups as expandable containers with their member lights underneath. Disabled by default to preserve the existing flat list behavior.","lights_sort_by_name":"Sort lights alphabetically","lights_sort_by_name_desc":"Sorts lights by display name instead of last changed. Applies to the lights view, room views, and nested light groups.","show_covers_summary":"Show cover summary","show_covers_view":"Always provide covers view","show_covers_view_desc":"Generates /covers even when the cover summary is hidden.","show_partially_open_covers":"Show partially open covers separately","show_partially_open_covers_desc":"Shows partially open covers (neither fully open nor closed) in a separate group.","show_security_summary":"Show security summary","show_security_view":"Always provide security view","show_security_view_desc":"Generates /security even when the security summary is hidden.","hide_hidden_areas_in_security":"Also hide hidden areas from security","hide_hidden_areas_in_security_desc":"By default security entities and cameras from overview-hidden areas remain visible. Enable this to filter them.","show_climate_summary":"Show climate summary","show_climate_summary_desc":"Shows the climate summary card on the overview. Counts active thermostats and climate devices.","show_climate_view":"Always provide climate view","show_climate_view_desc":"Generates /climate even when the climate summary is hidden.","show_battery_summary":"Show battery summary","show_battery_view":"Show battery view without summary","show_battery_view_desc":"Creates the /batteries subview even when the battery summary card is hidden on the overview.","hide_mobile_app_batteries":"Hide mobile app batteries","hide_mobile_app_batteries_desc":"Hides batteries from smartphones, tablets, and watches (Mobile App) from the battery overview and summary.","hide_battery_notes_entities":"Hide Battery Notes helpers","hide_battery_notes_entities_desc":"Hides helper entities created by the Battery Notes integration from the battery overview and summary.","show_area_in_battery_view":"Show area in battery tiles","show_area_in_battery_view_desc":"Prefixes battery tile names in the battery view with the assigned area name.","group_batteries_by_areas":"Group batteries by areas","group_batteries_by_areas_desc":"Groups batteries within each status by area and adds a trailing No area group.","battery_thresholds":"Battery thresholds","battery_critical_below":"Critical below","battery_low_below":"Low below","battery_thresholds_desc":"Thresholds for battery status groups (Critical / Low / Good).","unavailable_batteries_bucket":"Bucket unavailable batteries as","unavailable_batteries_bucket_desc":"Controls whether batteries with unavailable or non-numeric states default to the good or critical group.","show_weather":"Show weather card","show_weather_desc":"Shows the weather forecast card on the overview when a weather entity is available.","show_weather_forecast_card":"Keep legacy weather forecast enabled","show_weather_forecast_card_desc":"Legacy compatibility switch. If disabled, the weather section defaults to no presentation unless an explicit weather presentation is selected.","weather_presentation":"Weather presentation:","weather_sensors_desc":"Optional sensor row above the weather card. One line per sensor in the format entity|icon|unit|round.","show_energy":"Show energy dashboard","show_energy_desc":"Shows the energy distribution card on the overview when energy data is available.","show_energy_distribution_card":"Show energy distribution card","power_badge_entity":"Power badge entity:","power_badge_none":"None","power_badge_entity_desc":"Shows the selected entity as an extra header badge, for example current household power usage.","agenda_calendar_entities":"Calendar entities:","agenda_calendar_entities_desc":"Optional comma-separated list of calendar entities for the agenda section. Leave empty to auto-detect visible calendars.","todos_entities":"Todo entities:","todos_entities_desc":"Optional comma-separated list of todo entities for the todos section. Leave empty to auto-detect visible todo lists.","section_favorites":"Favorites","select_entity":"Select entity...","add":"+ Add","favorites_desc":"Select entities to be shown as favorites below the summaries. Entities are displayed as tiles.","light_favorites":"Favorite lights","light_favorites_entities":"Light entity IDs (comma-separated)","light_favorites_desc":"Adds a dedicated quick-access section for selected lights.","room_visibility":"Room visibility by entity state","room_visibility_desc":"Room views and navigation tabs are generated only while the configured entity has the expected state.","room_visibility_entity":"Entity ID","room_visibility_state":"Expected state","show_state":"Show state","hide_last_changed":"Hide last changed","section_areas_rooms":"Areas & Rooms","section_areas":"Areas","area_overview_options":"Area cards on overview","room_view_options":"Room view content","area_management_options":"Area list & sorting","group_by_floors":"Group areas by floors","group_by_floors_desc":"Groups areas on the overview by floors. When enabled, a separate section is created for each floor.","area_display_type":"Area card display","area_display_type_desc":"Sets the default display for all area cards. Picture mode uses the area picture configured in Home Assistant; areas without a picture remain compact.","area_display_type_compact":"Compact","area_display_type_picture":"Area picture","area_display_type_override":"Area card display","area_display_type_inherit":"Use global setting","area_display_type_no_picture":"This area has no picture. Its card remains compact when picture mode is selected.","show_switches_on_areas":"Show switches on area cards","show_switches_on_areas_desc":"Shows switches as controls on the area cards in the overview. Home Assistant hides these by default.","show_alerts_on_areas":"Show alert icons on area cards","show_alerts_on_areas_desc":"Shows alert icons (e.g. motion, moisture, heat) on area cards when a binary sensor in the area is active.","show_locks_in_rooms":"Show locks in room views","show_locks_in_rooms_desc":"Shows locks (e.g. Nuki) in the respective room views. Locks always appear in the security overview regardless.","show_cover_controls_in_rooms":"Show batch buttons on cover headings","show_cover_controls_in_rooms_desc":"Shows open, stop and close buttons for suitable covers and curtains in room views.","show_automations_in_rooms":"Show automations in room views","show_automations_in_rooms_desc":"Shows automations assigned to the area in the respective room views.","show_scripts_in_rooms":"Show scripts in room views","show_scripts_in_rooms_desc":"Shows scripts assigned to the area in the respective room views.","show_vacuums_section_in_rooms":"Dedicated vacuum section in rooms","show_vacuums_section_in_rooms_desc":"Shows vacuums and lawn mowers in their own section instead of Misc.","show_switches_section_in_rooms":"Dedicated switches & outlets section","show_switches_section_in_rooms_desc":"Shows switches and smart outlets in their own room section instead of Misc.","show_helpers_section_in_rooms":"Helpers & controls section","show_helpers_section_in_rooms_desc":"Shows helpers (input_boolean, input_number, input_select, timer, counter …) and user-facing select, number, button, siren and remote entities assigned to the room in their own section.","show_sensors_section_in_rooms":"Detectors & sensors section","show_sensors_section_in_rooms_desc":"Shows motion, presence, leak, smoke, gas and similar binary sensors as tiles with their last change. Room badges stay unchanged.","camera_live_toggle":"Use camera live toggle","camera_live_toggle_desc":"Uses the camera wrapper with a play/stop toggle. Without this option, native Home Assistant camera cards are shown.","show_energy_in_rooms":"Show energy block in room views","show_energy_in_rooms_desc":"Shows the area\'s power, energy, water, and gas sensors as a dedicated block in the respective room view.","show_ups_in_rooms":"Show UPS in room views","show_ups_in_rooms_desc":"Automatically detects UPS devices and shows a block per device with battery level and related sensors in the respective room view. Sensors hidden via the \'no_dboard\' label or entity options are not included.","hide_grouped_climate_members":"Hide controlled thermostats","hide_grouped_climate_members_desc":"Hides physical thermostats that Better Thermostat or a climate group already controls, so the same radiator is not shown twice. The controlling entity stays visible.","show_window_contacts_in_rooms":"Show window contacts in room views","show_window_contacts_in_rooms_desc":"Shows window contacts as badges in the respective room views.","show_door_contacts_in_rooms":"Show door contacts in room views","show_door_contacts_in_rooms_desc":"Shows door contacts as badges in the respective room views.","use_default_area_sort":"Use Home Assistant sorting","use_default_area_sort_desc":"Uses the area sorting from Home Assistant instead of the order configured here.","areas_manage_desc":"Choose which areas should be shown on the dashboard and in what order. Expand areas to manage individual entities.","area_entity_settings_desc":"Expand an area to configure entities, ordering, cameras, and additional cards.","area_pin_nav":"Show in navigation","section_room_pins":"Room Pins","room_pins_desc":"Select entities to be shown first in their assigned rooms. Ideal for entities that are not automatically detected (e.g. weather stations, special sensors). <strong>Only entities with room assignment can be selected.</strong> These pins only appear in their respective room, not on the overview.","section_views":"Views","user_visibility":"User visibility","user_visibility_warning":"Display logic only: hidden views remain reachable by URL. Reload the dashboard after changes.","user_visibility_no_person_warning":"User accounts without a linked person cannot be selected and lose a view as soon as that view has a rule.","user_visibility_views":"Views and entry points","user_visibility_sections":"Overview sections","show_summary_views":"Show summary views","show_summary_views_desc":"Shows the summary views (Lights, Covers, Security, Batteries) in the top navigation.","show_room_views":"Show room views","show_room_views_desc":"Shows individual room views in the top navigation.","show_cctv_view":"Show experimental CCTV view","show_cctv_view_desc":"Creates an optional camera view grouped by area.","cctv_show_activity":"Show CCTV activity history","cctv_show_activity_desc":"Shows motion, occupancy, and doorbell activity for the last twelve hours. LLM Vision timelines can be configured separately below.","show_maintenance_view":"Show maintenance view","show_maintenance_view_desc":"Shows pending updates, unavailable entities, and maintenance tips.","section_advanced":"Advanced","section_area_views":"Areas and custom views","area_view_override_intro":"Manage areas or expand one to paste a complete Lovelace view as YAML.","area_view_override_title":"Custom area view","area_view_override_help":"The YAML replaces the automatically generated view for this area. Title, path, and icon still come from the Home Assistant area.","area_view_override_remove":"Remove custom view","area_view_override_object_error":"YAML must produce a complete view object","section_advanced_options":"Global display options","hidden_section_headings":"Hide section headings","hidden_section_headings_desc":"Hides generated heading cards for selected overview sections while keeping their content visible.","section_visibility":"Conditional section visibility","section_visibility_desc":"Only show a generated overview section when the selected entity matches the configured state.","hide_unavailable_entities":"Hide unavailable entities","hide_unavailable_entities_desc":"Dynamically hides entity cards and badges whose state is \'unavailable\' or \'unknown\'. As soon as the entity is available again, it reappears without a reload.","dense_section_placement":"Use dense section placement","dense_section_placement_desc":"Enables dense placement in generated sections views so gaps in the grid can be filled automatically.","hide_completed_todos":"Hide completed to-dos","hide_completed_todos_desc":"Hides completed items in automatically generated to-do cards.","section_custom_content":"Custom Content","section_custom_content_desc":"Custom cards, sections, badges, and views are managed here in one place. The start page layout can place these items directly.","custom_content_weather_start_hint":"Cards and sections for the weather start page are edited above in the layout order. This area only keeps content that is not placed there.","section_custom_sections":"Custom Sections","custom_sections_help":"Create complete sections with a custom title, icon, and any cards. Each section appears as a separate section on the overview.","custom_section_yaml_invalid":"The section YAML must contain a valid section or card configuration.","no_custom_sections":"No custom sections created","add_custom_section":"+ Add new section","custom_section_title_placeholder":"Section title (optional)","custom_section_icon_placeholder":"Icon (e.g. mdi:star)","add_card_to_section":"+ Add card","section_custom_cards":"Custom Cards","custom_cards_heading_placeholder":"Custom Cards","custom_cards_desc":"Heading and icon for the custom cards section on the dashboard. Leave empty for defaults.","add_custom_card":"+ Add new card","video_tutorial":"Watch video tutorial","custom_cards_help":"Add custom cards to the overview. Cards appear in a separate section between summaries and areas. Tip: Create the card in a regular dashboard first, copy the YAML code, and paste it here.","section_custom_badges":"Custom Badges","add_custom_badge":"+ Add new badge","custom_badges_help":"Add custom badges to the overview header (next to person chips).","section_custom_views":"Custom Views","add_custom_view":"+ Add new view","custom_views_help":"Create custom views with any cards. Tip: Create the view in a regular dashboard first, copy the YAML code, and paste it here.","custom_view_position_end":"Position: end of tab bar (default)","custom_view_position_after":"Position: after","add_custom_view_ref":"+ Reference view from dashboard","custom_views_ref_help":"Referenced views are loaded live from the source dashboard on every load. Strategy dashboards cannot be referenced.","ref_loading":"Loading dashboards ...","ref_no_dashboards":"No referenceable dashboards found","ref_select_dashboard":"Select dashboard ...","ref_select_view":"Select view ...","ref_view_untitled":"View","ref_default_dashboard":"Default dashboard","ref_dashboard_missing":"The referenced dashboard is missing or no longer referenceable","ref_valid":"Reference valid","ref_incomplete":"Select a dashboard and view","no_favorites":"No favorites added","no_room_pins":"No room pins added","no_results":"No results found","search_options":"Search options","search_options_placeholder":"Search options, e.g. windows or show_ups…","show_changed_only":"Show only options changed from the default","no_changed_options":"No options differ from the defaults.","search_yaml_only":"YAML only","no_room":"No room","no_custom_views":"No custom views created","no_custom_cards":"No custom cards created","no_custom_badges":"No custom badges created","no_areas":"No areas available","no_entities_in_area":"No entities found in this area","loading_entities":"Loading entities...","new_view":"New View","new_card":"New Card","title_placeholder":"Title","path_placeholder":"Path (e.g. my-view)","yaml_placeholder":"Paste YAML code here...","card_title_placeholder":"Dashboard heading (optional)","card_editor_title_label":"Editor name","card_editor_title_placeholder":"Card name (editor only)","card_dashboard_title_label":"Dashboard heading","card_editor_title_help":"This name only helps with finding and sorting the card. It is not shown on the dashboard.","edit_card_with_ha_editor":"Edit card with HA editor","yaml_valid":"YAML valid","area_custom_cards_title":"Custom Cards","area_custom_cards_help":"Custom cards, tiles, and complete sections for this room view. Shown in addition to the automatic sections.","area_custom_card_new":"New card/section","area_custom_card_add_yaml":"+ Add YAML/section","area_custom_card_add_picker":"+ Choose card","area_custom_card_position":"Placement","area_custom_card_position_top":"Top (before auto sections)","area_custom_card_position_bottom":"Bottom (after auto sections)","area_custom_card_mode":"Input mode","area_custom_card_mode_yaml":"YAML (free-form)","area_custom_card_mode_tile":"Tile (guided)","area_custom_card_mode_section":"Section (YAML)","area_custom_card_entity":"Entity","area_custom_card_entity_select":"Select entity...","move_up":"Move up","move_down":"Move down","domain_lights":"Lighting","domain_climate":"Climate","domain_covers":"Blinds & Covers","domain_covers_curtain":"Curtains","domain_covers_window":"Windows, Doors & Gates","domain_media_player":"Media","domain_scenes":"Scenes","domain_vacuum":"Vacuums and lawn mowers","domain_fan":"Fans","domain_switches":"Switches","domain_locks":"Locks","domain_badges":"Room Badges","badges_additional":"Additional Badges","badges_add":"Add","badges_select_entity":"Select entity...","badges_remove":"Remove","badges_show_name":"Show entity name on badge","badges_name_short":"Name","weather_start_order":"Weather Start Layout Order","weather_start_order_desc":"Drag and drop the blocks to set their order on the weather start page. Hidden blocks are preserved.","weather_start_stack_warning":"Several blocks are appended to the same column. Check the resulting height on mobile devices.","weather_start_responsive_warning":"{count} nested grids use fixed columns. Prefer grid_options for responsive layouts.","weather_start_block_expand":"Customize block","weather_start_block_yaml_desc":"Enter one or more card configs as YAML. If set, replaces the auto-generated content of this block.","weather_start_card_yaml_desc":"Edit the card YAML, for example entity ID, name, icon, color, or other Lovelace options.","weather_start_section_cards_desc":"Edit the cards in this section. The section itself is placed in the layout order.","weather_start_add_content_desc":"Add content to the weather start page:","weather_start_add_card":"+ Card on start page","weather_start_add_summaries":"+ Summaries","weather_start_add_section":"+ Section on start page","weather_start_add_area":"Add area...","weather_start_add_floor":"Add floor...","weather_start_summary_size":"Size:","weather_start_summary_size_mini":"Small","weather_start_summary_size_normal":"Normal","weather_start_stack_with_previous":"Show below previous block in the same column","weather_start_block_title":"Heading","weather_start_block_title_placeholder":"Default heading","remove":"Remove","weather_start_block_reset":"Reset to default","show_pollen_card_desc":"Shows the current pollen load (today + tomorrow) below the weather card. Uses the DWD Pollenflug integration from HACS.","show_cameras_in_security":"Show cameras in the security view","show_cameras_in_security_desc":"Shows the cameras as compact still-image cards in the security view (like the Home Assistant security panel). When the camera view is enabled, the cameras heading links straight to it.","security_cameras_visibility_desc":"Unchecked cameras disappear from the security and camera views — room views are unaffected.","security_extra_entities_desc":"Pick any extra entities (smart appliances, custom sensors, etc.) to show as tiles at the bottom of the Security view. Useful for ovens, cooktops, irons — anything you want a glance at before leaving the house.","show_camera_view":"Enable camera view (CCTV) — experimental","show_camera_view_desc":"Under active development, details may still change. Generates a dedicated camera view: live picture, spotlight, PTZ controls and recordings link (Reolink) per camera.","show_camera_events":"Show LLM Vision event timelines","show_camera_events_desc":"Person/animal/vehicle timelines at the end of the camera view (requires LLM Vision + llmvision-card). Note: the card re-fetches its events on every state change — on busy systems this can create noticeable load.","show_window_alerts_on_areas_desc":"Shows an alert icon on the area card whenever a window, door, opening, or garage-door contact sensor in that area is open. Independent of the regular alert toggle above.","show_cameras_in_rooms":"Show cameras in room views","show_cameras_in_rooms_desc":"Shows cameras assigned to the area in the respective room views. Disable to keep cameras out of the dashboard without hiding them globally.","start_camera_stream":"Start live stream","stop_camera_stream":"Stop live stream","hide_unavailable_in_rooms_desc":"Skips entities whose state is `unavailable` (offline integrations, dead batteries, disconnected ESPHome devices) when building room views. Default on — these entities show up elsewhere (Batteries view, the optional Unavailable alert badge) and tend to be noise in a room view. Disable to surface them in the room view too.","custom_sections_desc":"Declare your own overview section blocks — just copy the complete section code (type: grid + cards) from any dashboard and paste it. Heading (heading card) and visibility are controlled directly in the YAML. The section key works in Section Order, as a target section for custom cards and in visibility rules.","area_custom_sections_desc":"Your own section blocks for this room view — paste complete section code (heading card inside the YAML, optional; visibility via visibility), placed above or below the auto-generated sections. Single cards are wrapped into a section automatically.","view_visibility_desc":"Choose which users can see each view tab. Without a restriction the view is visible to everyone. This is display logic only, not access control.","view_visibility_sections_desc":"Choose per overview section which users can see it (e.g. weather, energy or your custom sections).","show_maintenance_summary":"Show maintenance summary — experimental","show_maintenance_summary_desc":"Adds a “Maintenance” tile with its own subview (/maintenance): pending updates, unavailable devices, critical batteries and HA repairs (HA 2026.3+, admins only).","maintenance_visible_users_desc":"Without a selection every user sees the tile and tab. Options come from persons linked to an HA user. Note: display logic only, not access control — the view stays reachable by URL.","show_video_tips":"Show expert tips (videos)","show_video_tips_desc":"Shows up to three matching Dashboard Strategy videos (German language) for your installed integrations in the maintenance view. Static list shipped with the bundle — nothing is fetched or transmitted. Each tip can be dismissed permanently per browser.","show_maintenance_activity":"Show activity log","show_maintenance_activity_desc":"Logbook of the last 24 hours in the sidebar — scoped to the entities this view currently reports (pending updates, unavailable devices, critical batteries). Auto-hides without the logbook integration or when nothing is reported.","design_desc":"Theme and background image for all views of the dashboard. Custom views that set their own theme/background in YAML keep their setting.","diagnostics_no_state":"Registered without a state","diagnostics_disabled":"Disabled entity","diagnostics_unknown":"Unknown state","diagnostics_severity_error":"Errors","diagnostics_severity_warning":"Warnings","diagnostics_severity_info":"Notes","diagnostics_house_mode_unconfigured":"House mode block has no selected entity","diagnostics_layout_reference":"Layout references a missing custom block","diagnostics_room_override":"Custom room layout replaces generated room sections. Room options only apply where the custom layout uses them.","diagnostics_camera_preload":"Camera preloading is enabled and automatic pause explicitly disabled. This may increase load; stream usage has not been measured.","camera_pause_when_hidden":"Pause manual live video when hidden","camera_pause_when_hidden_desc":"Optional for native cameras with the live toggle: pauses outside the viewport or in a hidden browser tab and resumes manually started live video on return. Custom WebRTC cards are unchanged.","diagnostics_navigation_target":"Relative navigation target is not generated by this configuration","diagnostics_redundant_exclusion":"Already hidden by Home Assistant data (label, category, hidden, or controlled by a group) – this list entry is not needed","diagnostics_area_sensor_missing":"Room temperature/humidity sensor from the area settings has no state and the room has no other suitable sensor – no room badge is shown","diagnostics_area_sensor_hidden":"Room temperature/humidity sensor from the area settings is hidden or disabled in Home Assistant and the room has no other suitable sensor – no room badge is shown","diagnostics_area_sensor_override":"Room temperature/humidity sensor is hidden on the dashboard (category or hidden list) but still shown as room badge because it is assigned in the area settings","diagnostics_area_sensor_label":"Room temperature/humidity sensor from the area settings has the no_dboard label (on the entity or its device) and the room has no other suitable sensor – no room badge is shown","diagnostics_area_sensor_replaced":"Room temperature/humidity sensor from the area settings is not shown (no_dboard label, hidden, or no state); another visible sensor of the room is used automatically","diagnostics_option_label_excluded":"Entity has the no_dboard label and is not shown on this dashboard","camera_renderer":"Camera renderer","section_overview_sections":"Overview sections","overview_sections_desc":"Choose which automatically generated sections appear on the overview. A section stays hidden while it has no matching entities.","overview_sections_hint":"The position of each section is set under “Section Order”.","header_badges":"Header badges","overview_blocks":"Overview blocks","lights_options":"Lights view","covers_options":"Covers view","climate_options":"Climate view","battery_options":"Battery view","show_windows_summary":"Show open windows summary","show_windows_summary_desc":"Counts open window contacts and motorized windows separately from the security summary, for example for airing and heating. Opens the security view when it is available.","show_climate_air_quality":"Show humidity and CO₂ alerts","show_climate_air_quality_desc":"Adds a section to the climate view that lists humidity and CO₂ sensors while they are above the thresholds. The section hides itself when everything is fine.","climate_humidity_threshold":"Humidity above","climate_co2_threshold":"CO₂ above","show_energy_view":"Show energy view","show_energy_view_desc":"Adds a view with the highest current power consumers and the power, energy, water and gas sensors of each room.","show_media_section":"Show active media players","show_activity_section":"Show recent activity","quick_actions":"Quick actions","no_quick_actions":"No quick actions added","quick_actions_desc":"Scenes, scripts, buttons and automations run with one tap; other entities are toggled. The bar appears on the overview as soon as one entity is added.","remove_entity":"Remove entity"}}');var o=a.t(i,2);const r=(0,a(3401).Rv)(o,{de:()=>a.e(325).then(()=>a.t(8935,19)),hu:()=>a.e(177).then(()=>a.t(1179,19)),pl:()=>a.e(488).then(()=>a.t(8280,19)),ru:()=>a.e(215).then(()=>a.t(2153,19))})}}]);