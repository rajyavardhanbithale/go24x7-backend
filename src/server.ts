import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { ValidateEnv } from '@utils/validateEnv';
import { FileUploadRoute } from './routes/fileupload.route';
import { ServiceProviderCategoryRoute } from './routes/spcategory.route';

ValidateEnv();

const app = new App(
    [
        new AuthRoute(),
        new FileUploadRoute(),
        new ServiceProviderCategoryRoute()
    ]
);

app.listen();
