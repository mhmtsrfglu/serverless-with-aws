import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod, IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface DLPAPIGatewayProps{
    orderService: IFunction
    companyService: IFunction
}

export class DLPAPIGateway extends Construct{

    public readonly orderApi: LambdaRestApi;
    public readonly companiesApi: LambdaRestApi;

    constructor(scope: Construct, id: string, props: DLPAPIGatewayProps) {
        super(scope,id)
        this.orderApi = this.createOrderApi(props.orderService)
        this.companiesApi = this.createCompanyApi(props.companyService)
    }

    private createOrderApi(orderService: IFunction):LambdaRestApi {

        const apigw = new LambdaRestApi(this, 'orderApi', {
            restApiName: 'Order Service',
            handler: orderService,
            proxy: false
        });
    
        const order = apigw.root.addResource('orders');

        const pickOrder= order.addResource("peek")
        pickOrder.addMethod("GET")

        const todaysOrder = order.addResource("todaysOrders")
        todaysOrder.addMethod(HttpMethod.GET)
       
        const addOrder = order.addResource("new")
        addOrder.addMethod(HttpMethod.POST)

        const getOrdersByCompany = order.addResource("listByCompany").addResource("{id}")
        getOrdersByCompany.addMethod(HttpMethod.GET) 

        return apigw
    }

    private createCompanyApi(companiesService: IFunction):LambdaRestApi {

        const apigw = new LambdaRestApi(this, 'companiesApi', {
            restApiName: 'Company Service',
            handler: companiesService,
            proxy: false
        });
    
        const company = apigw.root.addResource('company');
        company.addMethod(HttpMethod.GET)

        const companyById = company.addResource("{id}")
        companyById.addMethod(HttpMethod.GET)

        const newCompany = company.addResource("new")
        newCompany.addMethod(HttpMethod.POST)

        const deleteCompanyResource = company.addResource("delete")
        const deleteCompanyById = deleteCompanyResource.addResource("{id}")
        deleteCompanyById.addMethod(HttpMethod.DELETE)

        return apigw
    }
}