import.packages("pacman")
library(pacman)
pacman::p_load(pacman, dplyr, raster, sf, rgdal, rasterVis, ggplot2)
lfmc <- raster("Downloading GeoTIFF/Extracted Files/lfmc/lfmc_map_2018-11-01.tif")
lfmc_df <- rasterToPoints(lfmc) %>% 
           data.frame()
wind <- raster("Downloading GeoTIFF/Extracted Files/wind/my_export_la_20181101.tif")
wind_df <- rasterToPoints(wind) %>%
           data.frame()
temp <- raster("Downloading GeoTIFF/Extracted Files/temperature/my_export_la_2018_11_01.tif")
# In LST data, it says that there is a 0.02 scaling factor for Kelvin. Convert K > C > F
temp <- 1.8*(0.02*temp - 273.15) + 32
temp_df <- rasterToPoints(temp) %>%
           data.frame()
combined_score <- 1/80 * (max(wind-30, 0) + max(temp-40, 0)) * lfmc
combined_score_df <- rasterToPoints(combined_score) %>%
                     data.frame()
ggplot() + geom_raster(data = combined_score_df, aes(x = x, y = y, fill = layer)) + scale_fill_gradientn(name = "Relative Risk", colors = c("green", "red")) + ggtitle("Estimated Wildfire Risk Before Woolsey Fire") + coord_equal()
