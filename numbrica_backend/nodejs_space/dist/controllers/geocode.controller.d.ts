import { GeoccodingService } from '../services/geocoding.service';
import { GeocodeDto, GeocodeResponseDto } from '../dto/geocode.dto';
export declare class GeocodeController {
    private readonly geocodingService;
    private readonly logger;
    constructor(geocodingService: GeoccodingService);
    geocode(geocodeDto: GeocodeDto): Promise<GeocodeResponseDto>;
}
