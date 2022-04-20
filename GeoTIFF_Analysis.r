import.packages("pacman")
library(pacman)
pacman::p_load(pacman, dplyr, raster, sf, rgdal, rasterVis, ggPlot2)
before_woolsey <- raster("Downloading GeoTIFF/Extracted Files/lfmc/lfmc_map_2018-11-01.tif") %>%
                  rasterToPoints() %>%
                  data.frame()
                  
