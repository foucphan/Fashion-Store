import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Store,
  People,
  Star,
  LocalShipping,
  Security,
  Support,
  TrendingUp,
  Favorite,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

export const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          color: '#1976d2', 
          fontWeight: 'bold',
          mb: 2
        }}>
          Giới Thiệu Fashion Store
        </Typography>
        <Typography variant="h6" sx={{ 
          color: 'text.secondary',
          maxWidth: '800px',
          mx: 'auto',
          lineHeight: 1.6
        }}>
          Chúng tôi là cửa hàng thời trang hàng đầu, cam kết mang đến những sản phẩm chất lượng cao 
          và dịch vụ khách hàng tốt nhất.
        </Typography>
      </Box>

      {/* Mission & Vision */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 6 }}>
        <Card elevation={3} sx={{ flex: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Store sx={{ mr: 2, color: '#1976d2', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Sứ Mệnh
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              Chúng tôi cam kết mang đến những sản phẩm thời trang chất lượng cao, 
              phù hợp với mọi lứa tuổi và phong cách. Mục tiêu của chúng tôi là 
              giúp khách hàng tự tin và tỏa sáng trong mọi hoàn cảnh.
            </Typography>
          </CardContent>
        </Card>
        
        <Card elevation={3} sx={{ flex: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUp sx={{ mr: 2, color: '#1976d2', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Tầm Nhìn
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              Trở thành thương hiệu thời trang hàng đầu Việt Nam, được khách hàng 
              tin tưởng và yêu mến. Chúng tôi hướng tới việc mở rộng ra thị trường 
              quốc tế trong tương lai gần.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Values */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4, color: '#1976d2' }}>
          Giá Trị Cốt Lõi
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 3 }}>
          {[
            { icon: <Security />, title: 'Chất Lượng', desc: 'Sản phẩm được kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng' },
            { icon: <People />, title: 'Khách Hàng', desc: 'Đặt khách hàng làm trung tâm trong mọi hoạt động kinh doanh' },
            { icon: <Star />, title: 'Sáng Tạo', desc: 'Luôn cập nhật xu hướng thời trang mới nhất và độc đáo' },
            { icon: <Support />, title: 'Dịch Vụ', desc: 'Hỗ trợ khách hàng 24/7 với đội ngũ chuyên nghiệp' },
          ].map((value, index) => (
            <Card elevation={2} key={index} sx={{ flex: '1 1 300px', textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {React.cloneElement(value.icon, { sx: { fontSize: 40, color: '#1976d2' } })}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Team */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4, color: '#1976d2' }}>
          Đội Ngũ Của Chúng Tôi
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 3 }}>
          {[
            { name: 'Nguyễn Văn A', position: 'Giám đốc điều hành', avatar: 'A' },
            { name: 'Trần Thị B', position: 'Giám đốc marketing', avatar: 'B' },
            { name: 'Lê Văn C', position: 'Trưởng phòng thiết kế', avatar: 'C' },
            { name: 'Phạm Thị D', position: 'Trưởng phòng CSKH', avatar: 'D' },
          ].map((member, index) => (
            <Card elevation={2} key={index} sx={{ flex: '1 1 250px', textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#1976d2' }}>
                  {member.avatar}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.position}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Achievements */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4, color: '#1976d2' }}>
          Thành Tựu
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 3 }}>
          {[
            { number: '10,000+', label: 'Khách hàng hài lòng' },
            { number: '50,000+', label: 'Sản phẩm đã bán' },
            { number: '5+', label: 'Năm kinh nghiệm' },
            { number: '99%', label: 'Tỷ lệ hài lòng' },
          ].map((achievement, index) => (
            <Paper elevation={3} key={index} sx={{ flex: '1 1 200px', p: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                {achievement.number}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {achievement.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Services */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4, color: '#1976d2' }}>
          Dịch Vụ Của Chúng Tôi
        </Typography>
        <List>
          {[
            { icon: <LocalShipping />, title: 'Giao hàng miễn phí', desc: 'Miễn phí giao hàng cho đơn hàng từ 500,000đ' },
            { icon: <Security />, title: 'Bảo hành chính hãng', desc: 'Bảo hành 30 ngày cho tất cả sản phẩm' },
            { icon: <Support />, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ CSKH luôn sẵn sàng hỗ trợ' },
            { icon: <Favorite />, title: 'Đổi trả dễ dàng', desc: 'Đổi trả trong 7 ngày nếu không hài lòng' },
          ].map((service, index) => (
            <ListItem key={index} sx={{ mb: 2 }}>
              <ListItemIcon>
                {React.cloneElement(service.icon, { sx: { color: '#1976d2', fontSize: 28 } })}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {service.title}
                    </Typography>
                    <Chip label="Miễn phí" color="primary" size="small" />
                  </Box>
                }
                secondary={service.desc}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Contact Info */}
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4, color: '#1976d2' }}>
          Liên Hệ Với Chúng Tôi
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flex: 1 }}>
            <Phone sx={{ mr: 2, color: '#1976d2' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Hotline
              </Typography>
              <Typography variant="body1">1900 1234</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flex: 1 }}>
            <Email sx={{ mr: 2, color: '#1976d2' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Email
              </Typography>
              <Typography variant="body1">info@fashionstore.com</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flex: 1 }}>
            <LocationOn sx={{ mr: 2, color: '#1976d2' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Địa chỉ
              </Typography>
              <Typography variant="body1">123 Đường ABC, Quận 1, TP.HCM</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};