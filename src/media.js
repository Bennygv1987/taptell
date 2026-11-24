/* Admin uploads. Funnel images are embedded copies, so removing a library entry
   never invalidates a published funnel. The demo keeps the library in IndexedDB. */
var TTMedia = (function(){
  'use strict';
  var local, imported;
  var pageSize = 12;
  async function imageId(src){
    var digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(src));
    return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2,'0')).join('');
  }
  function openLocal(){
    if(!local) local = new Promise(function(resolve, reject){
      var req = indexedDB.open('taptell-demo-media', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('images', {keyPath:'id'});
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }).catch(function(err){ local = null; throw err; });
    return local;
  }
  async function localTransaction(mode, run){
    var conn = await openLocal();
    return new Promise(function(resolve, reject){
      var tx = conn.transaction('images', mode), result = run(tx.objectStore('images'));
      tx.oncomplete = () => resolve(result && result.result);
      tx.onabort = () => reject(tx.error || new Error('Speichern abgebrochen'));
    });
  }
  async function storeImage(server, name, src){
    var row = {id:await imageId(src), name:name, src:src, added_at:new Date().toISOString()};
    if(server){
      var result = await server.from('media_images').upsert(row);
      if(result.error) throw result.error;
    } else await localTransaction('readwrite', st => st.put(row));
    return row;
  }
  async function remove(server, id){
    // A compact tombstone prevents the legacy import from resurrecting an image.
    if(server){
      var result = await server.from('media_images').update({src:null,name:''}).eq('id',id).select('id').single();
      if(result.error) throw result.error;
    } else await localTransaction('readwrite', st => st.put({id:id,src:null,name:''}));
  }
  async function importDemo(db){
    var found = new Map();
    function scan(value, label){
      if(typeof value === 'string'){
        if(/^data:image\/[^;,]+;base64,/i.test(value) && !found.has(value)) found.set(value,label);
      } else if(value && typeof value === 'object') Object.values(value).forEach(v => scan(v,label));
    }
    for(var f of db.funnels) scan([f.theme,f.pages,f.published,f.versions],f.name);
    for(var c of db.clients || []) scan(c.logo,c.name);
    scan(db.brand,'Brand-Kit');
    for(var [src,name] of found){
      var row = {id:await imageId(src),name:name,src:src,added_at:'1970-01-01T00:00:00Z'};
      await localTransaction('readwrite', function(st){
        var get = st.getKey(row.id);
        get.onsuccess = () => { if(get.result === undefined) st.add(row); };
      });
    }
  }
  async function list(server, db, page){
    var start = page * pageSize;
    if(server){
      var result = await server.from('media_images').select('id,name,src').not('src','is',null)
        .order('added_at',{ascending:false}).order('id').range(start,start+pageSize);
      if(result.error) throw result.error;
      return result.data;
    }
    if(!imported) imported = importDemo(db).catch(function(e){ imported = null; throw e; });
    await imported;
    var all = await localTransaction('readonly', st => st.getAll());
    return all.filter(r => r.src).sort((a,b) => b.added_at.localeCompare(a.added_at) || a.id.localeCompare(b.id)).slice(start,start+pageSize+1);
  }
  return {storeImage, remove, list, pageSize};
})();
