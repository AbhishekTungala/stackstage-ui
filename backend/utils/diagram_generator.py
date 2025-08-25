"""
StackStage Diagram Generation Engine using Python Diagrams + Mermaid.js
Creates beautiful, professional architecture diagrams for cloud infrastructure
"""
import os
import json
import tempfile
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path

try:
    from diagrams import Diagram, Cluster, Edge
    from diagrams.aws.compute import EC2, ECS, Lambda, AutoScaling
    from diagrams.aws.database import RDS, ElastiCache, Redshift
    from diagrams.aws.network import ELB, CloudFront, Route53, NATGateway, InternetGateway
    from diagrams.aws.storage import S3
    from diagrams.aws.security import IAM, KMS, WAF, Shield
    from diagrams.aws.analytics import CloudWatch
    from diagrams.aws.integration import SQS, SNS
    from diagrams.gcp.compute import ComputeEngine, GKE, CloudFunctions
    from diagrams.gcp.database import BigQuery, CloudSQL, Firestore
    from diagrams.gcp.network import LoadBalancer, CDN
    from diagrams.azure.compute import VirtualMachines, ContainerInstances, FunctionApps
    from diagrams.azure.database import SQLDatabases, CosmosDB
    from diagrams.azure.network import LoadBalancers, CDN as AzureCDN
    DIAGRAMS_AVAILABLE = True
except ImportError:
    print("Python Diagrams not available, falling back to Mermaid.js only")
    DIAGRAMS_AVAILABLE = False

class DiagramGenerator:
    """Enhanced diagram generator using Python Diagrams and Mermaid.js"""
    
    def __init__(self):
        self.diagrams_available = DIAGRAMS_AVAILABLE
        self.output_dir = Path("generated_diagrams")
        self.output_dir.mkdir(exist_ok=True)
        
        # Component mapping for different cloud providers
        self.aws_components = {
            'ec2': EC2,
            'ecs': ECS,
            'lambda': Lambda,
            'autoscaling': AutoScaling,
            'rds': RDS,
            'elasticache': ElastiCache,
            'redshift': Redshift,
            'elb': ELB,
            'cloudfront': CloudFront,
            'route53': Route53,
            'natgateway': NATGateway,
            'internetgateway': InternetGateway,
            's3': S3,
            'iam': IAM,
            'kms': KMS,
            'waf': WAF,
            'shield': Shield,
            'cloudwatch': CloudWatch,
            'sqs': SQS,
            'sns': SNS
        }
        
        self.mermaid_templates = {
            'basic_web_app': self._get_basic_web_app_template(),
            'microservices': self._get_microservices_template(),
            'data_pipeline': self._get_data_pipeline_template(),
            'serverless': self._get_serverless_template(),
            'multi_tier': self._get_multi_tier_template()
        }
    
    def generate_python_diagram(self, architecture_data: Dict[str, Any]) -> Dict[str, str]:
        """Generate architecture diagram using Python Diagrams library"""
        if not self.diagrams_available:
            return {'error': 'Python Diagrams library not available'}
        
        try:
            diagram_name = architecture_data.get('name', 'StackStage_Architecture')
            provider = architecture_data.get('provider', 'aws').lower()
            components = architecture_data.get('components', [])
            
            # Create diagram with professional styling
            output_path = self.output_dir / f"{diagram_name.replace(' ', '_')}"
            
            with Diagram(
                name=diagram_name,
                filename=str(output_path),
                show=False,
                direction="TB",
                graph_attr={
                    "fontsize": "16",
                    "bgcolor": "white",
                    "pad": "1.0",
                    "nodesep": "0.8",
                    "ranksep": "1.0"
                }
            ) as diag:
                
                # Group components by layer/cluster
                clusters = self._organize_components_by_cluster(components, provider)
                component_nodes = {}
                
                # Create clusters and components
                for cluster_name, cluster_components in clusters.items():
                    with Cluster(cluster_name):
                        for comp in cluster_components:
                            node = self._create_component_node(comp, provider)
                            if node:
                                component_nodes[comp['id']] = node
                
                # Create connections
                connections = architecture_data.get('connections', [])
                for connection in connections:
                    source_id = connection.get('source')
                    target_id = connection.get('target')
                    label = connection.get('label', '')
                    
                    if source_id in component_nodes and target_id in component_nodes:
                        source_node = component_nodes[source_id]
                        target_node = component_nodes[target_id]
                        
                        if label:
                            source_node >> Edge(label=label) >> target_node
                        else:
                            source_node >> target_node
            
            return {
                'success': True,
                'diagram_path': f"{output_path}.png",
                'format': 'png',
                'tool': 'python_diagrams'
            }
            
        except Exception as e:
            return {
                'error': f'Failed to generate Python diagram: {str(e)}',
                'fallback': 'Using Mermaid.js instead'
            }
    
    def generate_mermaid_diagram(self, architecture_data: Dict[str, Any]) -> str:
        """Generate Mermaid.js diagram code"""
        components = architecture_data.get('components', [])
        connections = architecture_data.get('connections', [])
        provider = architecture_data.get('provider', 'aws').lower()
        pattern = architecture_data.get('pattern', 'multi_tier')
        
        # Use template if no specific components provided
        if not components and pattern in self.mermaid_templates:
            return self.mermaid_templates[pattern]
        
        # Generate custom Mermaid diagram
        diagram_lines = ['flowchart TB']
        
        # Define component styles
        diagram_lines.extend([
            '    %% Component Styling',
            '    classDef compute fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff',
            '    classDef storage fill:#55a3ff,stroke:#2d3436,stroke-width:2px,color:#fff',
            '    classDef network fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff',
            '    classDef security fill:#ff6b6b,stroke:#d63031,stroke-width:2px,color:#fff',
            '    classDef monitoring fill:#ffeaa7,stroke:#fdcb6e,stroke-width:2px,color:#000',
            ''
        ])
        
        # Create subgraphs for different layers
        clusters = self._organize_components_by_cluster(components, provider)
        
        for cluster_name, cluster_components in clusters.items():
            diagram_lines.append(f'    subgraph {cluster_name.replace(" ", "_")} ["{cluster_name}"]')
            
            for comp in cluster_components:
                comp_id = comp.get('id', '').replace('-', '_')
                comp_name = comp.get('name', comp.get('type', 'Component'))
                comp_icon = self._get_component_icon(comp.get('type', ''), provider)
                
                diagram_lines.append(f'        {comp_id}[{comp_icon} {comp_name}]')
            
            diagram_lines.append('    end')
            diagram_lines.append('')
        
        # Add connections
        diagram_lines.append('    %% Connections')
        for connection in connections:
            source = connection.get('source', '').replace('-', '_')
            target = connection.get('target', '').replace('-', '_')
            label = connection.get('label', '')
            
            if source and target:
                if label:
                    diagram_lines.append(f'    {source} -->|{label}| {target}')
                else:
                    diagram_lines.append(f'    {source} --> {target}')
        
        # Apply styles to components
        diagram_lines.append('')
        diagram_lines.append('    %% Apply Styles')
        for comp in components:
            comp_id = comp.get('id', '').replace('-', '_')
            comp_type = comp.get('type', '').lower()
            
            if any(keyword in comp_type for keyword in ['ec2', 'compute', 'vm', 'ecs', 'lambda']):
                diagram_lines.append(f'    class {comp_id} compute')
            elif any(keyword in comp_type for keyword in ['s3', 'storage', 'database', 'rds']):
                diagram_lines.append(f'    class {comp_id} storage')
            elif any(keyword in comp_type for keyword in ['lb', 'gateway', 'cdn', 'route53']):
                diagram_lines.append(f'    class {comp_id} network')
            elif any(keyword in comp_type for keyword in ['waf', 'security', 'iam', 'kms']):
                diagram_lines.append(f'    class {comp_id} security')
            elif any(keyword in comp_type for keyword in ['cloudwatch', 'monitoring', 'logging']):
                diagram_lines.append(f'    class {comp_id} monitoring')
        
        return '\n'.join(diagram_lines)
    
    def _organize_components_by_cluster(self, components: List[Dict], provider: str) -> Dict[str, List[Dict]]:
        """Organize components into logical clusters"""
        clusters = {
            'Internet': [],
            'Load Balancer': [],
            'Compute Layer': [],
            'Database Layer': [],
            'Storage Layer': [],
            'Security Services': [],
            'Monitoring': []
        }
        
        for comp in components:
            comp_type = comp.get('type', '').lower()
            
            if any(keyword in comp_type for keyword in ['internet', 'cdn', 'cloudfront']):
                clusters['Internet'].append(comp)
            elif any(keyword in comp_type for keyword in ['lb', 'load_balancer', 'alb', 'nlb']):
                clusters['Load Balancer'].append(comp)
            elif any(keyword in comp_type for keyword in ['ec2', 'compute', 'vm', 'ecs', 'lambda', 'fargate']):
                clusters['Compute Layer'].append(comp)
            elif any(keyword in comp_type for keyword in ['rds', 'database', 'db', 'sql', 'dynamodb', 'elasticache']):
                clusters['Database Layer'].append(comp)
            elif any(keyword in comp_type for keyword in ['s3', 'storage', 'bucket', 'efs', 'ebs']):
                clusters['Storage Layer'].append(comp)
            elif any(keyword in comp_type for keyword in ['waf', 'security', 'iam', 'kms', 'guardduty']):
                clusters['Security Services'].append(comp)
            elif any(keyword in comp_type for keyword in ['cloudwatch', 'monitoring', 'logging', 'xray']):
                clusters['Monitoring'].append(comp)
            else:
                clusters['Compute Layer'].append(comp)  # Default cluster
        
        # Remove empty clusters
        return {k: v for k, v in clusters.items() if v}
    
    def _create_component_node(self, component: Dict, provider: str):
        """Create a component node for Python Diagrams"""
        comp_type = component.get('type', '').lower()
        comp_name = component.get('name', comp_type)
        
        if provider == 'aws':
            component_map = {
                'ec2': lambda: EC2(comp_name),
                'ecs': lambda: ECS(comp_name),
                'lambda': lambda: Lambda(comp_name),
                'rds': lambda: RDS(comp_name),
                'elasticache': lambda: ElastiCache(comp_name),
                's3': lambda: S3(comp_name),
                'elb': lambda: ELB(comp_name),
                'cloudfront': lambda: CloudFront(comp_name),
                'route53': lambda: Route53(comp_name),
                'waf': lambda: WAF(comp_name),
                'cloudwatch': lambda: CloudWatch(comp_name)
            }
        
        elif provider == 'gcp':
            component_map = {
                'compute': lambda: ComputeEngine(comp_name),
                'gke': lambda: GKE(comp_name),
                'cloud_sql': lambda: CloudSQL(comp_name),
                'bigquery': lambda: BigQuery(comp_name),
                'cloud_functions': lambda: CloudFunctions(comp_name)
            }
        
        elif provider == 'azure':
            component_map = {
                'vm': lambda: VirtualMachines(comp_name),
                'sql': lambda: SQLDatabases(comp_name),
                'functions': lambda: FunctionApps(comp_name),
                'cosmosdb': lambda: CosmosDB(comp_name)
            }
        
        else:
            component_map = {}
        
        # Find matching component
        for key, creator in component_map.items():
            if key in comp_type:
                try:
                    return creator()
                except Exception:
                    pass
        
        # Fallback to generic component
        try:
            return EC2(comp_name) if provider == 'aws' else ComputeEngine(comp_name)
        except Exception:
            return None
    
    def _get_component_icon(self, comp_type: str, provider: str) -> str:
        """Get appropriate icon for component type"""
        comp_type = comp_type.lower()
        
        icon_map = {
            'ec2': '💻',
            'ecs': '📦', 
            'lambda': '⚡',
            'rds': '🗄️',
            'dynamodb': '🗃️',
            'elasticache': '⚡',
            's3': '🪣',
            'elb': '⚖️',
            'alb': '⚖️',
            'nlb': '⚖️',
            'cloudfront': '🌐',
            'route53': '📍',
            'waf': '🛡️',
            'iam': '👤',
            'kms': '🔑',
            'cloudwatch': '📊',
            'vpc': '🏠',
            'subnet': '📁',
            'internet_gateway': '🚪',
            'nat_gateway': '🌐',
            'load_balancer': '⚖️',
            'database': '🗄️',
            'storage': '💾',
            'compute': '💻',
            'network': '🌐',
            'security': '🛡️',
            'monitoring': '📊'
        }
        
        # Find best match
        for key, icon in icon_map.items():
            if key in comp_type:
                return icon
        
        return '📦'  # Default icon
    
    def _get_basic_web_app_template(self) -> str:
        """Template for basic web application architecture"""
        return '''flowchart TB
    subgraph Internet ["🌐 Internet"]
        Users[👥 Users]
    end
    
    subgraph AWS_Region ["🏢 AWS Region"]
        subgraph Security ["🛡️ Security Layer"]
            R53[📍 Route 53]
            CF[🌐 CloudFront CDN]
            WAF[🛡️ AWS WAF]
        end
        
        subgraph Public_Subnet ["📡 Public Subnet"]
            ALB[⚖️ Application Load Balancer]
            NAT[🌐 NAT Gateway]
        end
        
        subgraph Private_Subnet ["🔒 Private Subnet"]
            ASG[📦 Auto Scaling Group]
            EC2A[💻 EC2 Instance A]
            EC2B[💻 EC2 Instance B]
        end
        
        subgraph Database ["💾 Database Layer"]
            RDS_Primary[🗄️ RDS Primary]
            RDS_Replica[🗄️ RDS Read Replica]
            ElastiCache[⚡ ElastiCache Redis]
        end
        
        subgraph Storage ["💿 Storage"]
            S3[🪣 S3 Bucket]
        end
    end
    
    %% Connections
    Users --> R53
    R53 --> CF
    CF --> WAF
    WAF --> ALB
    ALB --> ASG
    ASG --> EC2A
    ASG --> EC2B
    EC2A --> RDS_Primary
    EC2B --> RDS_Primary
    RDS_Primary --> RDS_Replica
    EC2A --> ElastiCache
    EC2B --> ElastiCache
    EC2A --> S3
    EC2B --> S3
    EC2A --> NAT
    EC2B --> NAT
    
    %% Styling
    classDef compute fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    classDef storage fill:#55a3ff,stroke:#2d3436,stroke-width:2px,color:#fff
    classDef network fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff
    classDef security fill:#ff6b6b,stroke:#d63031,stroke-width:2px,color:#fff
    
    class EC2A,EC2B,ASG compute
    class RDS_Primary,RDS_Replica,ElastiCache,S3 storage
    class ALB,NAT,CF,R53 network
    class WAF security'''
    
    def _get_microservices_template(self) -> str:
        """Template for microservices architecture"""
        return '''flowchart TB
    subgraph Internet ["🌐 Internet"]
        Users[👥 Users]
        API_Clients[🔌 API Clients]
    end
    
    subgraph AWS_Cloud ["☁️ AWS Cloud"]
        subgraph API_Gateway ["🚪 API Gateway Layer"]
            APIGW[🔌 API Gateway]
            Lambda_Auth[⚡ Auth Lambda]
        end
        
        subgraph Microservices ["⚙️ Microservices"]
            User_Service[📦 User Service]
            Order_Service[📦 Order Service]
            Payment_Service[📦 Payment Service]
            Notification_Service[📦 Notification Service]
        end
        
        subgraph Message_Queue ["📬 Message Queue"]
            SQS[📨 SQS Queue]
            SNS[📢 SNS Topic]
        end
        
        subgraph Databases ["🗄️ Databases"]
            User_DB[🗄️ User Database]
            Order_DB[🗄️ Order Database]
            Payment_DB[🗄️ Payment Database]
        end
        
        subgraph Monitoring ["📊 Monitoring"]
            CloudWatch[📈 CloudWatch]
            XRay[🔍 X-Ray]
        end
    end
    
    %% API Flow
    Users --> APIGW
    API_Clients --> APIGW
    APIGW --> Lambda_Auth
    Lambda_Auth --> User_Service
    
    %% Service Connections
    APIGW --> User_Service
    APIGW --> Order_Service
    APIGW --> Payment_Service
    
    %% Database Connections
    User_Service --> User_DB
    Order_Service --> Order_DB
    Payment_Service --> Payment_DB
    
    %% Message Queue Connections
    Order_Service --> SQS
    Payment_Service --> SQS
    SQS --> Notification_Service
    Notification_Service --> SNS
    
    %% Monitoring
    User_Service -.-> CloudWatch
    Order_Service -.-> CloudWatch
    Payment_Service -.-> CloudWatch
    User_Service -.-> XRay
    Order_Service -.-> XRay
    
    %% Styling
    classDef compute fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    classDef storage fill:#55a3ff,stroke:#2d3436,stroke-width:2px,color:#fff
    classDef network fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff
    classDef monitoring fill:#ffeaa7,stroke:#fdcb6e,stroke-width:2px,color:#000
    classDef messaging fill:#fd79a8,stroke:#e84393,stroke-width:2px,color:#fff
    
    class User_Service,Order_Service,Payment_Service,Notification_Service,Lambda_Auth compute
    class User_DB,Order_DB,Payment_DB storage
    class APIGW network
    class CloudWatch,XRay monitoring
    class SQS,SNS messaging'''
    
    def _get_data_pipeline_template(self) -> str:
        """Template for data pipeline architecture"""
        return '''flowchart LR
    subgraph Data_Sources ["📊 Data Sources"]
        App_Logs[📝 Application Logs]
        DB_Events[🗄️ Database Events]
        API_Data[🔌 API Data]
        IoT_Sensors[🌡️ IoT Sensors]
    end
    
    subgraph Ingestion ["📥 Data Ingestion"]
        Kinesis[📊 Kinesis Data Streams]
        Lambda_Processor[⚡ Lambda Processor]
        SQS_Buffer[📨 SQS Buffer]
    end
    
    subgraph Processing ["⚙️ Data Processing"]
        EMR[📊 EMR Cluster]
        Glue[🔧 AWS Glue]
        Lambda_Transform[⚡ Transform Lambda]
    end
    
    subgraph Storage ["💾 Data Storage"]
        S3_Raw[🪣 S3 Raw Data]
        S3_Processed[🪣 S3 Processed]
        Redshift[📊 Redshift DW]
        DynamoDB[🗃️ DynamoDB]
    end
    
    subgraph Analytics ["📈 Analytics"]
        QuickSight[📊 QuickSight]
        Athena[🔍 Athena]
        SageMaker[🤖 SageMaker]
    end
    
    %% Data Flow
    App_Logs --> Kinesis
    DB_Events --> Kinesis
    API_Data --> SQS_Buffer
    IoT_Sensors --> Kinesis
    
    Kinesis --> Lambda_Processor
    SQS_Buffer --> Lambda_Transform
    Lambda_Processor --> S3_Raw
    Lambda_Transform --> S3_Raw
    
    S3_Raw --> Glue
    S3_Raw --> EMR
    Glue --> S3_Processed
    EMR --> S3_Processed
    
    S3_Processed --> Redshift
    S3_Processed --> DynamoDB
    
    Redshift --> QuickSight
    S3_Processed --> Athena
    S3_Processed --> SageMaker
    
    %% Styling
    classDef source fill:#55efc4,stroke:#00b894,stroke-width:2px,color:#000
    classDef ingestion fill:#fd79a8,stroke:#e84393,stroke-width:2px,color:#fff
    classDef processing fill:#fdcb6e,stroke:#e17055,stroke-width:2px,color:#000
    classDef storage fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    classDef analytics fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff
    
    class App_Logs,DB_Events,API_Data,IoT_Sensors source
    class Kinesis,Lambda_Processor,SQS_Buffer ingestion
    class EMR,Glue,Lambda_Transform processing
    class S3_Raw,S3_Processed,Redshift,DynamoDB storage
    class QuickSight,Athena,SageMaker analytics'''
    
    def _get_serverless_template(self) -> str:
        """Template for serverless architecture"""
        return '''flowchart TB
    subgraph Users ["👥 Users"]
        Web[🌐 Web App]
        Mobile[📱 Mobile App]
    end
    
    subgraph CDN ["🚀 Content Delivery"]
        CloudFront[🌐 CloudFront]
        S3_Static[🪣 S3 Static Assets]
    end
    
    subgraph API_Layer ["🔌 API Layer"]
        API_Gateway[🚪 API Gateway]
        Cognito[👤 Cognito Auth]
    end
    
    subgraph Functions ["⚡ Lambda Functions"]
        Auth_Lambda[🔐 Auth Function]
        CRUD_Lambda[📝 CRUD Function]
        Process_Lambda[⚙️ Process Function]
        Email_Lambda[📧 Email Function]
    end
    
    subgraph Storage ["💾 Storage Layer"]
        DynamoDB[🗃️ DynamoDB]
        S3_Data[🪣 S3 Data Lake]
        Parameter_Store[⚙️ Parameter Store]
    end
    
    subgraph Events ["📬 Event Processing"]
        EventBridge[⚡ EventBridge]
        SQS[📨 SQS]
        SNS[📢 SNS]
    end
    
    subgraph Monitoring ["📊 Observability"]
        CloudWatch[📈 CloudWatch]
        XRay[🔍 X-Ray]
    end
    
    %% User Flow
    Web --> CloudFront
    Mobile --> API_Gateway
    CloudFront --> S3_Static
    CloudFront --> API_Gateway
    
    %% Authentication
    API_Gateway --> Cognito
    Cognito --> Auth_Lambda
    
    %% API Routes
    API_Gateway --> CRUD_Lambda
    API_Gateway --> Process_Lambda
    
    %% Data Storage
    Auth_Lambda --> DynamoDB
    CRUD_Lambda --> DynamoDB
    Process_Lambda --> S3_Data
    
    %% Event Processing
    CRUD_Lambda --> EventBridge
    EventBridge --> Process_Lambda
    Process_Lambda --> SQS
    SQS --> Email_Lambda
    Email_Lambda --> SNS
    
    %% Configuration
    Auth_Lambda --> Parameter_Store
    Process_Lambda --> Parameter_Store
    
    %% Monitoring
    Auth_Lambda -.-> CloudWatch
    CRUD_Lambda -.-> CloudWatch
    Process_Lambda -.-> XRay
    
    %% Styling
    classDef serverless fill:#fd79a8,stroke:#e84393,stroke-width:2px,color:#fff
    classDef storage fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    classDef network fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff
    classDef monitoring fill:#ffeaa7,stroke:#fdcb6e,stroke-width:2px,color:#000
    classDef events fill:#55efc4,stroke:#00b894,stroke-width:2px,color:#000
    
    class Auth_Lambda,CRUD_Lambda,Process_Lambda,Email_Lambda serverless
    class DynamoDB,S3_Data,S3_Static,Parameter_Store storage
    class API_Gateway,CloudFront,Cognito network
    class CloudWatch,XRay monitoring
    class EventBridge,SQS,SNS events'''
    
    def _get_multi_tier_template(self) -> str:
        """Template for multi-tier architecture"""
        return '''flowchart TB
    subgraph Internet ["🌐 Internet"]
        Users[👥 Users]
    end
    
    subgraph AWS_Infrastructure ["☁️ AWS Infrastructure"]
        subgraph DNS_CDN ["🌐 Global Layer"]
            R53[📍 Route 53]
            CloudFront[🚀 CloudFront CDN]
            WAF[🛡️ AWS WAF]
        end
        
        subgraph Load_Balancer ["⚖️ Load Balancer Tier"]
            ALB[⚖️ Application Load Balancer]
        end
        
        subgraph Web_Tier ["🌐 Web Tier"]
            Web1[🌐 Web Server 1]
            Web2[🌐 Web Server 2]
            Web3[🌐 Web Server 3]
        end
        
        subgraph App_Tier ["⚙️ Application Tier"]
            App1[⚙️ App Server 1]
            App2[⚙️ App Server 2]
            App3[⚙️ App Server 3]
        end
        
        subgraph Cache_Layer ["⚡ Cache Layer"]
            Redis[⚡ ElastiCache Redis]
            Memcached[⚡ ElastiCache Memcached]
        end
        
        subgraph Database_Tier ["🗄️ Database Tier"]
            RDS_Primary[🗄️ RDS Primary]
            RDS_Replica1[🗄️ Read Replica 1]
            RDS_Replica2[🗄️ Read Replica 2]
        end
        
        subgraph Storage_Tier ["💾 Storage Tier"]
            S3[🪣 S3 Bucket]
            EFS[📁 EFS Shared Storage]
        end
    end
    
    %% Traffic Flow
    Users --> R53
    R53 --> CloudFront
    CloudFront --> WAF
    WAF --> ALB
    
    %% Web Tier
    ALB --> Web1
    ALB --> Web2
    ALB --> Web3
    
    %% Application Tier
    Web1 --> App1
    Web2 --> App2
    Web3 --> App3
    Web1 --> App2
    Web2 --> App3
    Web3 --> App1
    
    %% Cache Layer
    App1 --> Redis
    App2 --> Redis
    App3 --> Memcached
    
    %% Database Connections
    App1 --> RDS_Primary
    App2 --> RDS_Primary
    App3 --> RDS_Primary
    App1 --> RDS_Replica1
    App2 --> RDS_Replica2
    App3 --> RDS_Replica1
    
    %% Storage
    Web1 --> S3
    Web2 --> EFS
    Web3 --> S3
    App1 --> S3
    App2 --> EFS
    
    %% Database Replication
    RDS_Primary --> RDS_Replica1
    RDS_Primary --> RDS_Replica2
    
    %% Styling
    classDef web fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    classDef app fill:#fd79a8,stroke:#e84393,stroke-width:2px,color:#fff
    classDef database fill:#55a3ff,stroke:#2d3436,stroke-width:2px,color:#fff
    classDef cache fill:#fdcb6e,stroke:#e17055,stroke-width:2px,color:#000
    classDef network fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff
    classDef security fill:#ff6b6b,stroke:#d63031,stroke-width:2px,color:#fff
    
    class Web1,Web2,Web3 web
    class App1,App2,App3 app
    class RDS_Primary,RDS_Replica1,RDS_Replica2,S3,EFS database
    class Redis,Memcached cache
    class ALB,R53,CloudFront network
    class WAF security'''
    
    def create_architecture_diagram(self, 
                                  parsed_data: Dict[str, Any], 
                                  analysis_data: Dict[str, Any] = None,
                                  output_format: str = 'mermaid') -> Dict[str, Any]:
        """Main function to create architecture diagrams"""
        
        # Extract components from parsed Infrastructure as Code
        components = []
        connections = []
        provider = 'aws'  # Default
        
        if 'resources' in parsed_data:
            for resource in parsed_data['resources']:
                component = {
                    'id': resource.get('name', f"resource_{len(components)}"),
                    'name': resource.get('name', resource.get('type', 'Component')),
                    'type': resource.get('type', 'generic'),
                    'properties': resource.get('properties', {})
                }
                components.append(component)
                
                # Detect provider from resource types
                if resource.get('type', '').startswith('aws_'):
                    provider = 'aws'
                elif resource.get('type', '').startswith('google_'):
                    provider = 'gcp'
                elif resource.get('type', '').startswith('azurerm_'):
                    provider = 'azure'
        
        # Create architecture data structure
        architecture_data = {
            'name': 'StackStage Generated Architecture',
            'provider': provider,
            'components': components,
            'connections': connections,
            'pattern': self._detect_architecture_pattern(components)
        }
        
        result = {
            'architecture_data': architecture_data,
            'diagrams': {}
        }
        
        # Generate Mermaid diagram
        if output_format in ['mermaid', 'both']:
            mermaid_code = self.generate_mermaid_diagram(architecture_data)
            result['diagrams']['mermaid'] = mermaid_code
        
        # Generate Python diagram
        if output_format in ['python', 'both'] and self.diagrams_available:
            python_result = self.generate_python_diagram(architecture_data)
            result['diagrams']['python'] = python_result
        
        return result
    
    def _detect_architecture_pattern(self, components: List[Dict]) -> str:
        """Detect architecture pattern from components"""
        component_types = [comp.get('type', '').lower() for comp in components]
        
        # Check for serverless pattern
        if any('lambda' in comp_type for comp_type in component_types):
            return 'serverless'
        
        # Check for microservices pattern
        if len([comp for comp in component_types if 'service' in comp]) > 2:
            return 'microservices'
        
        # Check for data pipeline pattern
        if any(keyword in ' '.join(component_types) for keyword in ['kinesis', 'glue', 'redshift', 'athena']):
            return 'data_pipeline'
        
        # Default to multi-tier
        return 'multi_tier'
    
    def generate_comprehensive_diagram(self, 
                                     architecture_input: str,
                                     user_region: str = 'us-west-2') -> Dict[str, Any]:
        """Generate comprehensive diagram based on text input"""
        # Simple text analysis to create architecture components
        input_lower = architecture_input.lower()
        components = []
        connections = []
        
        # Basic component detection based on keywords
        if 'load balancer' in input_lower or 'alb' in input_lower:
            components.append({
                'id': 'load_balancer',
                'name': 'Load Balancer',
                'type': 'aws_lb'
            })
        
        if 'ec2' in input_lower or 'instances' in input_lower:
            components.append({
                'id': 'ec2_instances',
                'name': 'EC2 Instances',
                'type': 'aws_ec2'
            })
        
        if 'rds' in input_lower or 'database' in input_lower:
            components.append({
                'id': 'database',
                'name': 'RDS Database',
                'type': 'aws_rds'
            })
        
        if 's3' in input_lower or 'storage' in input_lower:
            components.append({
                'id': 's3_storage',
                'name': 'S3 Storage',
                'type': 'aws_s3'
            })
        
        # If no specific components found, use basic web app template
        if not components:
            return {
                'mermaid_diagram': self.mermaid_templates['basic_web_app'],
                'pattern_detected': 'basic_web_app',
                'components_detected': 0
            }
        
        # Create architecture data
        architecture_data = {
            'name': 'StackStage Analysis Architecture',
            'provider': 'aws',
            'components': components,
            'connections': connections,
            'region': user_region
        }
        
        # Generate Mermaid diagram
        mermaid_diagram = self.generate_mermaid_diagram(architecture_data)
        
        return {
            'mermaid_diagram': mermaid_diagram,
            'pattern_detected': self._detect_architecture_pattern(components),
            'components_detected': len(components),
            'architecture_data': architecture_data
        }