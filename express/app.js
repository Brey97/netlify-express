
const {MongoClient} = require('mongodb');
const imdb = require('./imdb');

async function main() {
  
    const uri = "mongodb+srv://Brey97:115075284815Brey@cluster-qkzte.mongodb.net/test?retryWrites=true&w=majority";

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
       
        await client.connect();
        
        var result = await client.db("movies_imdb").collection("movie_review").find({"metascore":{$gt:70}});
       
        const results = await result.toArray();
        console.log(results[Math.floor(Math.random() * (results.length))]);

    } catch (e) {
      
      if (e.name === 'BulkWriteError')
      {
        console.log("Those values already exist in the database...");
      }
      else
      {
        console.error(e);
      }
        
    }
    finally {
        
        await client.close();
    }
    
}



module.exports.insert = async (actor) => {

  const uri = "mongodb+srv://Brey97:115075284815Brey@cluster-qkzte.mongodb.net/test?retryWrites=true&w=majority";
  let movies;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {      
      await client.connect();
      movies = await imdb(actor);
      await client.db("movies_imdb").collection("movie_review").insertMany(movies);
      
  } catch (e) { 
    if (e.name === 'BulkWriteError')
    {
      return("Those values already exist in the database...");
    }
    else
    {
      console.error(e);
    }
      
  }
  finally {
      await client.close();
  }
  return { "total" : movies.length}
}

module.exports.getrandom = async () => {

  const uri = "mongodb+srv://Brey97:115075284815Brey@cluster-qkzte.mongodb.net/test?retryWrites=true&w=majority";

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  let results
  try {      
    await client.connect();
    var result = await client.db("movies_imdb").collection("movie_review").find({"metascore":{$gt:70}});
    
    //console.log(movies.length);
    results = await result.toArray();
  } catch (e) { 
    console.error(e);
      
  }
  finally {
      await client.close();
  }
  return results[Math.floor(Math.random() * (results.length))]
}


module.exports.getmovie_id = async (id) => {

  const uri = "mongodb+srv://Brey97:115075284815Brey@cluster-qkzte.mongodb.net/test?retryWrites=true&w=majority";

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {      
    await client.connect();
    
    var result = await client.db("movies_imdb").collection("movie_review").findOne({"id":id});
  } catch (e) { 
    console.error(e);
      
  }
  finally {
      await client.close();
  }
  return result
}

module.exports.addreview = async (id,updates) => {

  const uri = "mongodb+srv://Brey97:115075284815Brey@cluster-qkzte.mongodb.net/test?retryWrites=true&w=majority";
  var result;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {      
    await client.connect();
    result = await client.db("movies_imdb").collection("movie_review").updateOne({"_id": id }, { $set: updates });
    
  } catch (e) { 
    console.error(e);
      
  }
  finally {
      await client.close();
  }
  return {"_id" : id};
}


module.exports.getsearchmovie = async (metascore, limit) => {
  const uri = "mongodb+srv://Brey97:115075284815Brey@cluster-qkzte.mongodb.net/test?retryWrites=true&w=majority";

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  try {
    await client.connect();
    const movies = await client.db("movies_imdb").collection("movie_review").find({metascore:{ $gte: metascore }}).sort({ metascore: -1 }).toArray();
    if(movies.length>=limit) 
    {
      result=[];
      for (let i = 0; i < limit; i++)
      {
         result[i]=movies[i];
      }
      return [movies.length, result]
    }
    else
    {
      return [movies.length, movies]
    }
    } catch (e) {
      console.error(e);
    } finally {
          await client.close();
    }
};
