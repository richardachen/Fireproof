import ee
from ee import batch
# https://www.programiz.com/python-programming/datetime/current-datetime
from datetime import date

# initialization
ee.Authenticate()
ee.Initialize()

today = date.today()
start_date = ee.Date(str(today))

# get climate data
modis = ee.ImageCollection('MODIS/006/MOD11A1')
gridMET = ee.ImageCollection("IDAHO_EPSCOR/GRIDMET")
fldas = ee.ImageCollection("NASA/FLDAS/NOAH01/C/GL/M/V001")

# https://gis.stackexchange.com/questions/354435/filter-image-collection-to-one-specific-date-earth-engine
lst_collection = ee.ImageCollection(modis.select('LST_Day_1km')).filterDate(start_date, start_date.advance(1, 'day'))
above_wind_collection = ee.ImageCollection(gridMET.select('vs')).filterDate(start_date, start_date.advance(1, 'day'))
below_wind_collection = ee.ImageCollection(fldas.select('Wind_f_tavg')).filterDate(start_date, start_date.advance(1, 'day'))
max_humidity_collection = ee.ImageCollection(gridMET.select('rmax')).filterDate(start_date, start_date.advance(1, 'day'))
min_humidity_collection = ee.ImageCollection(gridMET.select('rmin')).filterDate(start_date, start_date.advance(1, 'day'))

scale = 250

# Woolsey Fire locations
la_lon = -117.9267511
la_lat = 34.2817777
la_poi = ee.Geometry.Point(la_lon, la_lat)
la = la_poi.buffer(1e5) #1e5 meters

crs = ee.Image(lst_collection.first()).projection()

def resample(image):
  """
  Resample to new resolution
  """
  image = image.resample('bilinear').reproject(crs=crs, scale=scale)
  return image
if scale != 250:
  lst_collection = lst_collection.map(resample)

n = lst_collection.size().getInfo()
lst_colList = lst_collection.toList(n)
above_wind_colList = above_wind_collection.toList(n)
below_wind_colList = below_wind_collection.toList(n)
max_humidity_colList = max_humidity_collection.toList(n)
min_humidity_colList = min_humidity_collection.toList(n)

type_dict = {
    'lst': lst_colList,
    '10m_wind': above_wind_colList,
    '0m_wind': below_wind_colList,
    'max_humidity': max_humidity_colList,
    'min_humidity': min_humidity_colList
}

for i in range(n):
  for version in type_dict:
    image = ee.Image(type_dict[version].get(i))
    id = image.id().getInfo() or 'image_'+i.toString()
    info_stuff = image.getInfo()
    date = info_stuff['properties']['system:index']

    out = ee.batch.Export.image.toDrive(image=image,
                                        description=version,
                                        folder=version,
                                        scale=250,
                                        region=la,
                                        fileNamePrefix='my_export_' + version + '_' + date,
                                        crs='EPSG:4326',
                                        fileFormat='GeoTIFF',
                                        maxPixels=1e11)
    batch.Task.start(out)