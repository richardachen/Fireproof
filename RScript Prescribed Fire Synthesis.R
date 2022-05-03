import.packages("pacman")
library(pacman)
pacman::p_load(pacman, dplyr, raster, sf, rgdal, rasterVis, ggplot2)
# loading all of the data
surface_wind <- raster("0m wind/my_export_201811.tif")
surface_wind_lwr_bd <- setValues(surface_wind ,1)
surface_wind_upr_bd <- setValues(surface_wind, 3)
high_wind <- raster("10m wind/my_export_20181101.tif")
high_wind_lwr_bd <- setValues(surface_wind, 6)
high_wind_upr_bd <- setValues(surface_wind, 18)
min_humidity <- raster("min humidity/my_export_20181101.tif")
max_humidity <- raster("max humidity/my_export_20181101.tif")
temp <- raster("lst/my_export_2018_11_01.tif")
temp_lwr_bd <- setValues(temp, 20)
temp_upr_bd <- setValues(temp, 60)
# manipulation of the data

# conversion of temp from Kelvin to Celsius to Fahrenheit
temp <- 1.8*(0.02*temp-273.15)+32
# conversion of surface and high wind to mph
surface_wind <- surface_wind*2.23694
high_wind <- high_wind*2.23694
# overall humidity
overall_humidity <- (min_humidity + max_humidity)/2
overall_humidity_lwr_bd <- setValues(overall_humidity, 40)
overall_humidity_upr_bd <- setValues(overall_humidity, 55)

within_bounds = function(x1,x2,x3){
  ifelse(x2<=x1&x1<=x3,1,0)
}
temp_tf <- overlay(temp, temp_lwr_bd, temp_upr_bd, fun = within_bounds)
overall_humidity_tf <- overlay(overall_humidity, overall_humidity_lwr_bd, overall_humidity_upr_bd, fun = within_bounds)
surface_wind_tf <- overlay(surface_wind, surface_wind_lwr_bd, surface_wind_upr_bd, fun = within_bounds)
high_wind_tf <- overlay(high_wind, high_wind_lwr_bd, high_wind_upr_bd, fun = within_bounds)
overall_value <- temp_tf + overall_humidity_tf + surface_wind_tf + high_wind_tf
overall_value_df <- rasterToPoints(overall_value) %>% data.frame()
ggplot() + geom_raster(data = overall_value_df, aes(x = x, y = y, fill = layer)) + scale_fill_gradientn(name = "Optimality of Weather Conditions for Prescribed Burn", colors = c("red", "green")) + ggtitle("Estimated Favorability of Weather Conditions for a Prescribed Burn") + coord_equal()
