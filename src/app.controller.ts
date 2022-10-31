import { Controller, Get } from "@nestjs/common";

@Controller("")
export class AppController {
    @Get("/healthcheck")
    healthcheck() {
        return "Organization service is working!";
    }
}
